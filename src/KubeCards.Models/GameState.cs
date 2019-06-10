using System;

namespace KubeCards.Models
{
    public class GameState
    {
        public string GameId { get; set; }
        public Player Player1 { get; set; }
        public Player Player2 { get; set; }
        public GameAction[] History { get; set; }
        public string NextPlayerUserId { get; set; }
        public DateTime LastUpdatedDateTimeUtc { get; set; }
    }
}
