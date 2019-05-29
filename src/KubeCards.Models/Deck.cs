using System;
using System.Collections.Generic;
using System.Text;

namespace KubeCards.Models
{
    public class Deck
    {
        public string DeckId { get; set; }
        public Card[] Cards { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }
        public DateTime LastVerifiedDateTimeUtc { get; set; }
    }
}
