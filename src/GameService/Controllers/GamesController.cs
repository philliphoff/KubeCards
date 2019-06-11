using GameService.Data;
using KubeCards.Common;
using KubeCards.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace GameService.Controllers
{
    [Authorize]
    [Route("api/games")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IGameStateProvider gameStateProvider;

        public GamesController(IConfiguration configuration, IGameStateProvider gameStateProvider)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            this.gameStateProvider = gameStateProvider ?? throw new ArgumentNullException(nameof(gameStateProvider));
        }

        // GET api/games
        [ProducesResponseType(typeof(GameState), StatusCodes.Status200OK)]
        [HttpGet]
        public async Task<ActionResult<GameState[]>> GetAsync()
        {
            string userId = User.GetUserId();

            GameState gameState = await this.gameStateProvider.GetGameStateForUserAsync(userId);

            if (gameState == null)
            {
                return Array.Empty<GameState>();
            }

            return new GameState[] { gameState };
        }

        // GET api/games/[gameId]
        [ProducesResponseType(typeof(GameState), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{gameId}")]
        public async Task<ActionResult<GameState>> GetAsync(string gameId)
        {
            string userId = User.GetUserId();

            GameState gameState = await this.gameStateProvider.GetGameStateAsync(userId, gameId);

            if (gameState == null)
            {
                return new NotFoundObjectResult(gameId);
            }

            return gameState;
        }

        // POST api/games
        [ProducesResponseType(typeof(GameState), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost]
        public async Task<ActionResult<GameState>> Post([FromBody] string deckId)
        {
            string userId = User.GetUserId();
            string authToken = this.Request.GetBearerAuthToken();
            GameOperation operation = await this.gameStateProvider.StartGameAsync(userId, deckId, authToken);
            if (!operation.Succeeded)
            {
                return new BadRequestObjectResult(operation.ErrorMessage);
            }

            return operation.GameState;
        }

        // POST api/games/[gameId]/play
        [ProducesResponseType(typeof(GameState), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost("{gameId}/play")]
        public async Task<ActionResult<GameState>> Post(string gameId, [FromBody] string cardId)
        {
            string userId = User.GetUserId();
            GameOperation operation = await this.gameStateProvider.PlayCardAsync(userId, gameId, cardId);
            if (!operation.Succeeded)
            {
                return new BadRequestObjectResult(operation.ErrorMessage);
            }

            return operation.GameState;
        }
    }
}
