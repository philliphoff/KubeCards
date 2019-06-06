namespace KubeCards.Models
{
    public class DeckInventory
    {
        public string UserId { get; set; }

        public Deck[] Decks { get; set; }
    }
}
