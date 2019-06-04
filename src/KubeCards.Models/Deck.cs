using System;

namespace KubeCards.Models
{
    public class Deck
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public Card[] Cards { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }
        public DateTime LastVerifiedDateTimeUtc { get; set; }
    }
}
