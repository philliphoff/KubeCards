using KubeCards.Models;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DecksService.Data
{
    public class DeckInventoryProvider : IDeckInventoryProvider
    {
        private readonly IConfiguration configuration;

        public DeckInventoryProvider(IConfiguration configuration)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public DeckInventory GetDeckInventory(string userId)
        {
            if (userId == null)
            {
                var deckInventory = new DeckInventory()
                {
                    UserId = userId
                };
                return deckInventory;
            }

            var endpointUri = new Uri(this.configuration["DecksDB_Endpoint"]);
            string authKey = this.configuration["DecksDB_AuthKey"];
            var documentClient = new DocumentClient(endpointUri, authKey);

            string databaseId = this.configuration["DecksDB_Database"];
            string collectionId = this.configuration["DecksDB_Collection"];

            var collectionUri = UriFactory.CreateDocumentCollectionUri(databaseId, collectionId);
            var sqlQuerySpec = new SqlQuerySpec("select * from Items i where i.userId = @userIdParameter");
            sqlQuerySpec.Parameters.Add(new SqlParameter("userIdParameter", userId));

            IQueryable<dynamic> queryResult = documentClient.CreateDocumentQuery<Deck>(collectionUri, sqlQuerySpec);

            //UriFactory.CreateDocumentUri(databaseId, collectionId, )


            //string sqlConnectionString = this.configuration["CardsDBConnectionString"];
            //using (var connection = new SqlConnection(sqlConnectionString))
            //{
            //    string sql = "select CardId, CardValue, CreatedDateTimeUtc from dbo.UserCards where UserId = @UserIdValue";
            //    IEnumerable<Card> cards = connection.Query<Card>(sql, new { UserIdValue = userId });
            //    var cardInventory = new CardInventory()
            //    {
            //        UserId = userId,
            //        Cards = cards.ToArray()
            //    };

            //    return cardInventory;
            //}
        }
    }
}
