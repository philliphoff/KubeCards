using System;
using System.Collections.Generic;
using System.Text;

namespace KubeCards.Models
{
    public class CardInventory
    {
        public string UserId { get; set; }

        public Card[] Cards { get; set; }
    }
}
