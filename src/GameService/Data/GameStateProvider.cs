using KubeCards.Common;
using KubeCards.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace GameService.Data
{
    public class GameStateProvider : IGameStateProvider
    {
        private readonly IConfiguration configuration;
        private readonly ConnectionMultiplexer redis;

        public GameStateProvider(IConfiguration configuration)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            this.redis = ConnectionMultiplexer.Connect(this.configuration["RedisConnectionString"]);
        }

        public async Task<GameState> GetGameStateForUserAsync(string userId)
        {
            string userIdKey = GetUserIdKey(userId);
            string gameId = await ReadStringFromDatabaseAsync(userIdKey);
            if (string.IsNullOrWhiteSpace(gameId))
            {
                return null;
            }

            return await GetGameStateAsync(userId, gameId);
        }

        public async Task<GameState> GetGameStateAsync(string userId, string gameId, bool sanitizeGameState = true)
        {
            string gameIdKey = GetGameIdKey(gameId);
            string gameStateJson = await ReadStringFromDatabaseAsync(gameIdKey);
            if (string.IsNullOrWhiteSpace(gameStateJson))
            {
                return null;
            }

            try
            {
                GameState gameState = JsonConvert.DeserializeObject<GameState>(gameStateJson);
                if (!ObjectId.IdsMatch(userId, gameState.Player1?.UserId) &&
                    !ObjectId.IdsMatch(userId, gameState.Player2?.UserId))
                {
                    return null;
                }

                if (sanitizeGameState)
                {
                    RemovePrivateGameStateInfo(userId, gameState);
                }

                return gameState;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<GameOperation> PlayCardAsync(string userId, string gameId, string cardId)
        {
            GameState gameState = await GetGameStateAsync(userId, gameId, sanitizeGameState: false);
            if (gameState == null)
            {
                return GameOperation.Failure("No such game.");
            }

            GameOperation operation = GameHandler.PlayCard(userId, cardId, gameState);
            if (operation.Succeeded)
            {
                await PersistGameToDatabaseAsync(userId, operation.GameState);

                // sanitize game state for user
                RemovePrivateGameStateInfo(userId, operation.GameState);
            }

            return operation;
        }

        public async Task<GameOperation> StartGameAsync(string userId, string userName, string deckId, string authToken)
        {
            var redisDb = this.redis.GetDatabase();

            Deck deck = await GetDeckAsync(deckId, authToken);
            if (deck == null)
            {
                return GameOperation.Failure("No such deck");
            }

            GameOperation operation = GameHandler.StartGame(userId, userName, deck);
            if (operation.Succeeded)
            {
                await PersistGameToDatabaseAsync(userId, operation.GameState);

                // sanitize game state for user
                RemovePrivateGameStateInfo(userId, operation.GameState);
            }

            return operation;
        }

        public async Task<GameOperation> CompleteGameAsync(string userId, string gameId)
        {
            GameState gameState = await GetGameStateAsync(userId, gameId, sanitizeGameState: false);
            if (gameState == null)
            {
                return GameOperation.Failure("No such game.");
            }

            GameOperation operation = GameHandler.CompleteGame(userId, gameState);
            if (operation.Succeeded)
            {
                await PersistGameToDatabaseAsync(userId, operation.GameState);

                // sanitize game state for user
                RemovePrivateGameStateInfo(userId, operation.GameState);
            }

            return operation;
        }

        private async Task PersistGameToDatabaseAsync(string userId, GameState gameState)
        {
            string gameStateJson = JsonConvert.SerializeObject(gameState);
            string gameKeyId = GetGameIdKey(gameState.GameId);
            await WriteStringToDatabaseAsync(gameKeyId, gameStateJson);
            string userIdKey = GetUserIdKey(userId);
            await WriteStringToDatabaseAsync(userIdKey, gameState.GameId);
        }

        private async Task<Deck> GetDeckAsync(string deckId, string authToken)
        {
            using (var httpClient = HttpClientProvider.GetHttpClient(authToken))
            {
                string decksServiceEndpoint = this.configuration["DecksServiceEndpoint"];
                string decksServiceUrl = FormattableString.Invariant($"{decksServiceEndpoint}/api/decks/{deckId}");
                HttpResponseMessage response = await httpClient.GetAsync(decksServiceUrl);
                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                string deckJson = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(deckJson))
                {
                    return null;
                }

                try
                {
                    Deck deck = JsonConvert.DeserializeObject<Deck>(deckJson);
                    return deck;
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        private async Task WriteStringToDatabaseAsync(string key, string value)
        {
            var redisDb = this.redis.GetDatabase();
            await redisDb.StringSetAsync(key, value, TimeSpan.FromHours(6));
        }

        private async Task<string> ReadStringFromDatabaseAsync(string key)
        {
            var redisDb = this.redis.GetDatabase();
            string result = await redisDb.StringGetAsync(key);
            return result;
        }

        private static void RemovePrivateGameStateInfo(string userId, GameState gameState)
        {
            Player opponent = ObjectId.IdsMatch(userId, gameState.Player1.UserId) ?
                gameState.Player2 : gameState.Player1;

            opponent.HandCards = null;
            opponent.Completed = false;
            opponent.DeckDisplayName = null;
        }

        private static string GetGameIdKey(string gameId)
        {
            string gameIdKey = FormattableString.Invariant($"GameId.{gameId}");
            return gameIdKey;
        }

        private static string GetUserIdKey(string userId)
        {
            string userIdKey = FormattableString.Invariant($"UserId.{userId}");
            return userIdKey;
        }
    }
}
