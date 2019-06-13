using KubeCards.Models;
using System;
using System.Threading.Tasks;

namespace GameService.Data
{
    public interface IGameStateProvider
    {
        Task<GameState> GetGameStateForUserAsync(string userId);
        Task<GameState> GetGameStateAsync(string userId, string gameId, bool sanitizeGameState = true);
        Task<GameOperation> PlayCardAsync(string userId, string gameId, string cardId);
        Task<GameOperation> StartGameAsync(string userId, string deckId, string authToken);
        Task<GameOperation> CompleteGameAsync(string userId, string gameId);
    }
}
