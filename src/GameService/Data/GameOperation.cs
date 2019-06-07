using KubeCards.Models;
using System;

namespace GameService.Data
{
    public class GameOperation
    {
        private GameOperation(string errorMessage, GameState gameState)
        {
            this.ErrorMessage = errorMessage;
            this.GameState = gameState;
        }

        public static GameOperation Failure(string errorMessage)
        {
            if (string.IsNullOrEmpty(errorMessage))
            {
                throw new ArgumentNullException(nameof(errorMessage));
            }

            return new GameOperation(errorMessage, null);
        }

        public static GameOperation Success(GameState gameState)
        {
            if (gameState == null)
            {
                throw new ArgumentNullException(nameof(gameState));
            }

            return new GameOperation(null, gameState);
        }

        public string ErrorMessage { get; }
        public GameState GameState { get; }
        public bool Succeeded => string.IsNullOrEmpty(this.ErrorMessage);
    }
}
