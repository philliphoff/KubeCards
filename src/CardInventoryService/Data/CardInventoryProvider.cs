using Dapper;
using KubeCards.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace CardInventoryService.Data
{
    public class CardInventoryProvider : ICardInventoryProvider
    {
        private readonly IConfiguration configuration;

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
    }
}
