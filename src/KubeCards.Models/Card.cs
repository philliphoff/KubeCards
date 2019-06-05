using System;

namespace KubeCards.Models
{
    public class Card
    {
        public string CardId { get; set; }
        public int CardValue { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }
    }
}
