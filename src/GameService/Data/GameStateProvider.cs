using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
