using Microsoft.Extensions.Configuration;
using System;

namespace GameService.Data
{
    public class GameStateProvider : IGameStateProvider
    {
        private readonly IConfiguration configuration;

        public GameStateProvider(IConfiguration configuration)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }
    }
}
