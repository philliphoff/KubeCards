using System;
using CardInventoryService.Data;
using KubeCards.Common;
using KubeCards.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace CardInventoryService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ICardInventoryProvider cardInventoryProvider;

        public CardsController(IConfiguration configuration, ICardInventoryProvider cardInventoryProvider)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            this.cardInventoryProvider = cardInventoryProvider ?? throw new ArgumentNullException(nameof(cardInventoryProvider));
        }

        // GET api/cards
        [HttpGet]
        public ActionResult<CardInventory> Get()
        {
            string userId = User.GetUserId();
            return this.cardInventoryProvider.GetCardInventory(userId);
        }

        [HttpPost("starter")]
        public ActionResult<CardInventory> PostStarterCards()
        {
            string userId = User.GetUserId();
            return this.cardInventoryProvider.AddStarterCards(userId);
        }
    }
}
