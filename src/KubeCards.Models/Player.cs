using System;
using System.Collections.Generic;
using System.Text;

namespace KubeCards.Models
{
    public class Player
    {
        public bool Completed { get; set; }
        public string DisplayName { get; set; }
        public string UserId { get; set; }
        public Card[] HandCards { get; set; }
        public Card[] PlayedCards { get; set; }
    }
}
