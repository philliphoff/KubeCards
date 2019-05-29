using KubeCards.Models;

namespace DecksService.Data
{
    public interface IDeckInventoryProvider
    {
        DeckInventory GetDeckInventory(string userId);
    }
}
