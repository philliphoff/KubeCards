using Dapper;
using KubeCards.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace CardInventoryService.Data
{
    public class CardInventoryProvider : ICardInventoryProvider
    {
        private readonly IConfiguration configuration;
        private readonly Random random = new Random();

        public CardInventoryProvider(IConfiguration configuration)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public CardInventory GetCardInventory(string userId)
        {
            if (userId == null)
            {
                var cardInventory = new CardInventory()
                {
                    UserId = userId
                };
                return cardInventory;
            }

            string sqlConnectionString = this.configuration["CardsDBConnectionString"];
            using (var connection = new SqlConnection(sqlConnectionString))
            {
                string sql = "select CardId, CardValue, CreatedDateTimeUtc from dbo.UserCards where UserId = @UserIdValue";
                IEnumerable<Card> cards = connection.Query<Card>(sql, new { UserIdValue = userId });
                var cardInventory = new CardInventory()
                {
                    UserId = userId,
                    Cards = cards.ToArray()
                };

                return cardInventory;
            }
        }

        public CardInventory AddStarterCards(string userId)
        {
            var currentCards = GetCardInventory(userId);

            if (currentCards.Cards.Any())
            {
                return currentCards;
            }

            var createdDate = DateTime.UtcNow;

            var cards =
                Enumerable
                    .Range(0, 10)
                    .Select(_ => this.random.Next(100) + 1)
                    .Select(value =>
                        new Card
                        {
                            CardId = Guid.NewGuid().ToString("N").ToLowerInvariant(),
                            CardValue = value,
                            CreatedDateTimeUtc = createdDate
                        });

            string sqlConnectionString = this.configuration["CardsDBConnectionString"];
            using (var connection = new SqlConnection(sqlConnectionString))
            {
                connection.Open();

                using (var transaction = connection.BeginTransaction())
                {
                    foreach (var card in cards)
                    {
                        using (var command = connection.CreateCommand())
                        {
                            command.CommandText = "insert into dbo.UserCards(UserId, CardId, CardValue, CreatedDateTimeUtc) values(@UserId, @CardId, @CardValue, @CreatedDateTimeUtc)";

                            command.Parameters.AddWithValue("@UserId", userId);
                            command.Parameters.AddWithValue("@CardId", card.CardId);
                            command.Parameters.AddWithValue("@CardValue", card.CardValue);
                            command.Parameters.AddWithValue("@CreatedDateTimeUtc", card.CreatedDateTimeUtc);

                            command.Transaction = transaction;

                            command.ExecuteNonQuery();
                        }
                    }

                    transaction.Commit();
                }
            }

            return this.GetCardInventory(userId);
        }
    }
}
