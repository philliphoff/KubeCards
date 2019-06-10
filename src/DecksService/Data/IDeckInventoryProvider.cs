using KubeCards.Models;
using System.Threading.Tasks;

namespace DecksService.Data
{
    public interface IDeckInventoryProvider
    {
        Task<Deck> CreateStarterDeckAsync(string userId, string authToken);
        Task<Deck> GetDeckAsync(string userId, string deckId, string authToken);
        Task<DeckInventory> GetDeckInventoryAsync(string userId, string authToken);
        Task<bool> DeleteDeckAsync(string userId, string deckId);
        Task<DeckOperationResult<UpsertResult>> UpsertDeckAsync(string userId, string deckId, Deck deck, string authToken);
    }
}
