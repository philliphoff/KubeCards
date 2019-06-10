using KubeCards.Common;
using KubeCards.Models;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DecksService.Data
{
    public class DeckInventoryProvider : IDeckInventoryProvider
    {
        private readonly IConfiguration configuration;

        public DeckInventoryProvider(IConfiguration configuration)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<Deck> GetDeckAsync(string userId, string deckId, string authToken)
        {
            if (userId == null)
            {
                return null;
            }

            using (DocumentClient documentClient = GetCosmosDbDocumentClient())
            {
                GetDeckResult result = await ReadDeckFromDatabaseAsync(documentClient, deckId);

                if (result.Deck == null)
                {
                    return null;
                }

                // So the deck exists in the database. But does the requesting user own it?
                if (!StringComparer.Ordinal.Equals(result.Deck.UserId, userId))
                {
                    return null;
                }

                await VerifyDecksIfNecessaryAsync(documentClient, new Deck[] { result.Deck }, authToken);

                return result.Deck;
            }
        }

        public async Task<DeckInventory> GetDeckInventoryAsync(string userId, string authToken)
        {
            var deckInventory = new DeckInventory()
            {
                UserId = userId
            };

            if (userId == null)
            {
                return deckInventory;
            }

            using (DocumentClient documentClient = GetCosmosDbDocumentClient())
            {
                Deck[] decks = ReadDecksFromDatabase(documentClient, userId);

                // Our Decks database caches card information for performance reasons
                // If our cached data is stale we update the card information from the card inventory service
                decks = await VerifyDecksIfNecessaryAsync(documentClient, decks, authToken);

                deckInventory.Decks = decks;
                return deckInventory;
            }
        }

        public async Task<bool> DeleteDeckAsync(string userId, string deckId)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(deckId))
            {
                return true;
            }

            using (DocumentClient documentClient = GetCosmosDbDocumentClient())
            {
                GetDeckResult result = await ReadDeckFromDatabaseAsync(documentClient, deckId);

                // Firstly, verify that the deck belongs to the user requesting its deletion
                if (ObjectId.IdsMatch(result.Deck?.UserId, userId))
                {
                    // Yup, the user id matches so we're clear to remove the deck from our database
                    await documentClient.DeleteDocumentAsync(result.DocumentUri);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public async Task<DeckOperationResult<UpsertResult>> UpsertDeckAsync(string userId, string deckId, Deck deck, string authToken)
        {
            try
            {
                using (DocumentClient documentClient = GetCosmosDbDocumentClient())
                {
                    UpsertResult upsertResult;
                    deck.Id = deckId;
                    deck.UserId = userId;

                    GetDeckResult getDeckResult = await ReadDeckFromDatabaseAsync(documentClient, deckId);
                    if (getDeckResult.Deck != null)
                    {
                        if (!StringComparer.Ordinal.Equals(getDeckResult.Deck.UserId, userId))
                        {
                            return new DeckOperationResult<UpsertResult>(UpsertResult.NotAuthorizedToModifyExisting, deck);
                        }
                        deck.CreatedDateTimeUtc = getDeckResult.Deck.CreatedDateTimeUtc;
                        upsertResult = UpsertResult.UpdatedExisting;
                    }
                    else
                    {
                        deck.CreatedDateTimeUtc = DateTime.UtcNow;
                        upsertResult = UpsertResult.CreatedNew;
                    }

                    IDictionary<string, Card> actualCards = await GetCardInventoryAsync(authToken);
                    VerifyDeck(deck, actualCards, DateTime.UtcNow);
                    await WriteDecksToDatabaseAsync(documentClient, new Deck[] { deck });
                    return new DeckOperationResult<UpsertResult>(upsertResult, deck);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private DocumentClient GetCosmosDbDocumentClient()
        {
            var endpointUri = new Uri(this.configuration[Constants.DecksDbEndpoint]);
            string authKey = this.configuration[Constants.DecksDbAuthKey];
            var documentClient = new DocumentClient(endpointUri, authKey);
            return documentClient;
        }

        private async Task<Deck[]> VerifyDecksIfNecessaryAsync(DocumentClient documentClient, Deck[] decks, string authToken)
        {
            if (decks == null)
            {
                return null;
            }

            TimeSpan refreshDataAfter = TimeSpan.FromHours(2);
            DateTime utcNow = DateTime.UtcNow;
            if (decks.Any(x => utcNow - x.LastVerifiedDateTimeUtc > refreshDataAfter))
            {
                IDictionary<string, Card> actualCards = await GetCardInventoryAsync(authToken);
                VerifyDecks(decks, actualCards, DateTime.UtcNow);
                await WriteDecksToDatabaseAsync(documentClient, decks);
            }

            return decks;
        }

        private Deck[] ReadDecksFromDatabase(DocumentClient documentClient, string userId)
        {
            Uri collectionUri = GetDocumentCollectionUri();
            try
            {
                var sqlQuerySpec = new SqlQuerySpec("select * from Items i where i.userId = @userIdParameter");
                sqlQuerySpec.Parameters.Add(new SqlParameter("@userIdParameter", userId));
                var feedOptions = new FeedOptions { JsonSerializerSettings = GetJsonSerializerSettings(), EnableCrossPartitionQuery = true };

                Deck[] decks = documentClient.CreateDocumentQuery<Deck>(collectionUri, sqlQuerySpec, feedOptions).ToArray();
                return decks;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }

        private async Task<GetDeckResult> ReadDeckFromDatabaseAsync(DocumentClient documentClient, string deckId)
        {
            string databaseId = this.configuration[Constants.DecksDbDatabaseName];
            string collectionId = this.configuration[Constants.DecksDbCollection];
            Uri documentUri = UriFactory.CreateDocumentUri(databaseId, collectionId, deckId);
            var requestOptions = new RequestOptions { PartitionKey = new PartitionKey(deckId) };

            try
            {
                Deck deck = await documentClient.ReadDocumentAsync<Deck>(documentUri, requestOptions);
                return new GetDeckResult() { Deck = deck, DocumentUri = documentUri };
            }
            catch (DocumentClientException dce)
            {
                if (StringComparer.OrdinalIgnoreCase.Equals(Constants.CosmosDbNotFoundErrorCode, dce.Error.Code))
                {
                    return new GetDeckResult() { Deck = null, DocumentUri = documentUri };
                }

                throw;
            }
        }

        private async Task WriteDecksToDatabaseAsync(DocumentClient documentClient, Deck[] decks)
        {
            var upsertTasks = new List<Task>();
            Uri collectionUri = GetDocumentCollectionUri();
            foreach (var deck in decks)
            {
                var requestOptions = new RequestOptions() { JsonSerializerSettings = GetJsonSerializerSettings() };
                Task upsertTask = documentClient.UpsertDocumentAsync(collectionUri, deck, requestOptions);
                upsertTasks.Add(upsertTask);
            }

            await Task.WhenAll(upsertTasks);
        }

        private Uri GetDocumentCollectionUri()
        {
            string databaseId = this.configuration[Constants.DecksDbDatabaseName];
            string collectionId = this.configuration[Constants.DecksDbCollection];

            var collectionUri = UriFactory.CreateDocumentCollectionUri(databaseId, collectionId);
            return collectionUri;
        }

        private void VerifyDecks(Deck[] decks, IDictionary<string, Card> actualCards, DateTime verificationTime)
        {
            foreach (var deck in decks)
            {
                VerifyDeck(deck, actualCards, verificationTime);
            }
        }

        private void VerifyDeck(Deck deck, IDictionary<string, Card> actualCards, DateTime verificationTime)
        {
            if (deck.Cards == null)
            {
                return;
            }

            var verifiedCards = new List<Card>(deck.Cards.Length);
            foreach (var cachedCard in deck.Cards)
            {
                if (actualCards.TryGetValue(cachedCard.CardId, out Card actualCard))
                {
                    verifiedCards.Add(actualCard);
                }
            }

            deck.Cards = verifiedCards.ToArray();
            deck.LastVerifiedDateTimeUtc = verificationTime;
        }

        private async Task<IDictionary<string, Card>> GetCardInventoryAsync(string authToken)
        {
            var cards = new Dictionary<string, Card>(StringComparer.OrdinalIgnoreCase);

            using (var httpClient = HttpClientProvider.GetHttpClient(authToken))
            {
                string endpoint = this.configuration[Constants.CardsServiceEndpoint];
                Uri uri = new Uri(FormattableString.Invariant($"https://{endpoint}/api/cards"));
                string result = await httpClient.GetStringAsync(uri);
                if (string.IsNullOrWhiteSpace(result))
                {
                    return null;
                }

                CardInventory cardInventory = JsonConvert.DeserializeObject<CardInventory>(result);
                if (cardInventory?.Cards != null)
                {
                    foreach (var card in cardInventory.Cards)
                    {
                        cards[card.CardId] = card;
                    }
                }
            }

            return cards;
        }

        private static JsonSerializerSettings GetJsonSerializerSettings()
        {
            return new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        }

        private struct GetDeckResult
        {
            public Deck Deck { get; set; }
            public Uri DocumentUri { get; set; }
        }
    }

    public enum UpsertResult
    {
        CreatedNew, UpdatedExisting, NotAuthorizedToModifyExisting
    }

    public class DeckOperationResult<T>
    {
        public DeckOperationResult(T result, Deck deck)
        {
            this.Result = result;
            this.Deck = deck;
        }

        public T Result { get; }
        public Deck Deck { get; }
    }
}
