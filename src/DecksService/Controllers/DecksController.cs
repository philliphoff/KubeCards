using DecksService.Data;
using KubeCards.Common;
using KubeCards.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace DecksService.Controllers
{
    [Authorize]
    [Route("api/decks")]
    [ApiController]
    public class DecksController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IDeckInventoryProvider deckInventoryProvider;

        public DecksController(IConfiguration configuration, IDeckInventoryProvider deckInventoryProvider)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            this.deckInventoryProvider = deckInventoryProvider ?? throw new ArgumentNullException(nameof(deckInventoryProvider));
        }

        // GET api/decks
        [HttpGet]
        public async Task<ActionResult<DeckInventory>> GetAsync()
        {
            string userId = User.GetUserId();
            string authToken = this.Request.GetBearerAuthToken();
            var deckInventory = await this.deckInventoryProvider.GetDeckInventoryAsync(userId, authToken);
            return deckInventory;
        }

        // GET api/decks/[deckId]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpGet("{deckId}")]
        public async Task<ActionResult<Deck>> GetAsync(string deckId)
        {
            if (!ObjectId.IsValidId(deckId))
            {
                return new BadRequestObjectResult("Invalid deckId");
            }

            string userId = User.GetUserId();
            string authToken = this.Request.GetBearerAuthToken();
            var deck = await this.deckInventoryProvider.GetDeckAsync(userId, deckId, authToken);
            return deck;
        }

        // POST api/decks
        [ProducesResponseType(typeof(Deck), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost]
        public async Task<ActionResult<Deck>> PostAsync([FromBody] Deck deck)
        {
            string deckId = ObjectId.GetNewId();
            ActionResult<Deck> result = await this.UpsertAsync(deckId, deck);
            return result;
        }

        // POST api/decks/starter
        [ProducesResponseType(typeof(Deck), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost("starter")]
        public async Task<ActionResult<Deck>> PostStarterAsync()
        {
            string userId = User.GetUserId();
            string authToken = this.Request.GetBearerAuthToken();
            
            var deck = await this.deckInventoryProvider.CreateStarterDeckAsync(userId, authToken);

            if (deck == null)
            {
                return new BadRequestResult();
            }

            return deck;
        }

        // PUT api/decks/[deckId]
        [ProducesResponseType(typeof(Deck), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Deck), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPut("{deckId}")]
        public async Task<ActionResult<Deck>> PutAsync(string deckId, [FromBody] Deck deck)
        {
            if (!ObjectId.IsValidId(deckId))
            {
                return new BadRequestObjectResult("Invalid deckId");
            }

            deckId = deckId.ToLowerInvariant();

            ActionResult<Deck> result = await this.UpsertAsync(deckId, deck);
            return result;
        }

        // DELETE api/decks/[deckId]
        [ProducesResponseType(StatusCodes.Status204NoContent)] // success or the deck didn't exist in the first place
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpDelete("{deckId}")]
        public async Task<IActionResult> DeleteAsync(string deckId)
        {
            if (!ObjectId.IsValidId(deckId))
            {
                return new BadRequestObjectResult("Invalid deckId");
            }

            string userId = User.GetUserId();
            bool success = await this.deckInventoryProvider.DeleteDeckAsync(userId, deckId);
            if (!success)
            {
                return new UnauthorizedResult();
            }

            return new NoContentResult();
        }

        private async Task<ActionResult<Deck>> UpsertAsync(string deckId, Deck deck)
        {
            if (deck == null)
            {
                return new BadRequestResult();
            }

            string userId = User.GetUserId();
            string authToken = this.Request.GetBearerAuthToken();

            DeckOperationResult<UpsertResult> operationResult = await this.deckInventoryProvider.UpsertDeckAsync(userId, deckId, deck, authToken);
            if (operationResult.Result == UpsertResult.NotAuthorizedToModifyExisting)
            {
                return new UnauthorizedResult();
            }
            else if (operationResult.Result == UpsertResult.CreatedNew)
            {
                string path = this.Request.Path;
                if (!path.EndsWith(deckId, StringComparison.OrdinalIgnoreCase))
                {
                    path = path.TrimEnd('/');
                    path += FormattableString.Invariant($"/{deckId}");
                }
                return new CreatedResult(path, operationResult.Deck);
            }
            else
            {
                return operationResult.Deck;
            }
        }
    }
}
