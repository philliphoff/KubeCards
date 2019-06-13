using KubeCards.Common;
using KubeCards.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameService.Data
{
    public static class GameHandler
    {
        private const int HandSize = 5;

        public static GameOperation StartGame(string userId, Deck deck)
        {
            if (!IsPlayableDeck(deck))
            {
                return GameOperation.Failure(FormattableString.Invariant($"Unplayable deck. A deck must contain {HandSize} or more cards."));
            }

            var gameState = new GameState();
            gameState.GameId = ObjectId.GetNewId();

            gameState.NextPlayerUserId = userId;
            gameState.Player1 = new Player
            {
                DisplayName = "Player1",
                HandCards = GetRandomHandFromDeck(deck),
                UserId = userId
            };

            gameState.Player2 = new Player
            {
                DisplayName = "Mr. Roboto",
                HandCards = GetRandomHandForAIPlayer(),
                UserId = ObjectId.ComputerPlayerId
            };

            gameState.LastUpdatedDateTimeUtc = DateTime.UtcNow;

            return GameOperation.Success(gameState);
        }

        public static GameOperation PlayCard(string userId, string cardId, GameState gameState)
        {
            if (!ObjectId.IsValidId(cardId))
            {
                return GameOperation.Failure("Invalid cardId.");
            }

            if (!ObjectId.IdsMatch(gameState.NextPlayerUserId, userId))
            {
                return GameOperation.Failure("It's not your turn.");
            }

            bool foundPlayer = TryGetPlayer(userId, gameState, out Player player, out Player opponent);
            if (!foundPlayer)
            {
                return GameOperation.Failure("You're not playing this game.");
            }

            bool foundCard = PlayHandCard(cardId, player, gameState);
            if (!foundCard)
            {
                return GameOperation.Failure("Invalid cardId.");
            }

            if (opponent.HandCards.Length > 0)
            {
                PlayHandCard(opponent.HandCards[0].CardId, opponent, gameState);
            }

            gameState.LastUpdatedDateTimeUtc = DateTime.UtcNow;

            return GameOperation.Success(gameState);
        }

        public static GameOperation CompleteGame(string userId, GameState gameState)
        {
            bool foundPlayer = TryGetPlayer(userId, gameState, out Player player, out Player opponent);
            if (!foundPlayer)
            {
                return GameOperation.Failure("You're not playing this game.");
            }

            if (!player.Completed)
            {
                player.Completed = true;
    
                gameState.LastUpdatedDateTimeUtc = DateTime.UtcNow;
            }

            return GameOperation.Success(gameState);
        }

        private static bool PlayHandCard(string cardId, Player player, GameState gameState)
        {
            var hand = new List<Card>();
            var played = player.PlayedCards?.ToList() ?? new List<Card>();
            Card foundCard = null;

            for (int i = 0; i < player.HandCards.Length; i++)
            {
                Card currentCard = player.HandCards[i];
                if (ObjectId.IdsMatch(currentCard.CardId, cardId))
                {
                    played.Add(currentCard);
                    foundCard = currentCard;
                }
                else
                {
                    hand.Add(currentCard);
                }
            }

            player.HandCards = hand.ToArray();
            player.PlayedCards = played.ToArray();

            if (foundCard != null)
            {
                LogCardPlayedAction(foundCard, player, gameState);
            }

            return foundCard != null;
        }

        private static void LogCardPlayedAction(Card foundCard, Player player, GameState gameState)
        {
            List<GameAction> gameActions = gameState.History?.ToList() ?? new List<GameAction>();
            gameActions.Add(new GameAction
            {
                ActionDateTimeUtc = DateTime.UtcNow,
                Description = FormattableString.Invariant($"{player.DisplayName} played a {foundCard.CardValue}.")
            });
            gameState.History = gameActions.ToArray();
        }

        private static bool TryGetPlayer(string userId, GameState gameState, out Player player, out Player opponent)
        {
            player = null;
            opponent = null;

            if (ObjectId.IdsMatch(gameState.Player1.UserId, userId))
            {
                player = gameState.Player1;
                opponent = gameState.Player2;
                return true;
            }

            if (ObjectId.IdsMatch(gameState.Player2.UserId, userId))
            {
                player = gameState.Player2;
                opponent = gameState.Player1;
                return true;
            }

            return false;
        }

        private static Card[] GetRandomHandForAIPlayer()
        {
            var random = new Random();
            var hand = new Card[HandSize];
            var utcNow = DateTime.UtcNow;
            for (int i = 0; i < HandSize; ++i)
            {
                hand[i] = new Card
                {
                    CardId = ObjectId.GetNewId(),
                    CardValue = random.Next(11),
                    CreatedDateTimeUtc = utcNow
                };
            }
            return hand;
        }

        private static Card[] GetRandomHandFromDeck(Deck deck)
        {
            var random = new Random();
            var hand = new Card[HandSize];
            var usedCards = new HashSet<int>();
            for (int i = 0; i < HandSize; ++i)
            {
                int cardIndex;
                do
                {
                    cardIndex = random.Next(deck.Cards.Length);
                }
                while (usedCards.Contains(cardIndex));
                usedCards.Add(cardIndex);
                hand[i] = deck.Cards[cardIndex];
            }
            return hand;
        }

        private static bool IsPlayableDeck(Deck deck)
        {
            if (deck == null || deck.Cards == null || deck.Cards.Length < HandSize)
            {
                return false;
            }

            foreach (var card in deck.Cards)
            {
                if (card == null)
                {
                    return false;
                }

                if (!ObjectId.IsValidId(card.CardId))
                {
                    return false;
                }
            }

            return true;
        }
    }
}
