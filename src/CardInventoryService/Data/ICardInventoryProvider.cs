using KubeCards.Models;

namespace CardInventoryService.Data
{
    public interface ICardInventoryProvider
    {
        CardInventory GetCardInventory(string userId);

        CardInventory AddStarterCards(string userId);
    }
}
