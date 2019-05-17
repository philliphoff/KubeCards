using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CardInventoryService.Data;
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
            string userId = User.Claims.Where(x => StringComparer.OrdinalIgnoreCase.Equals(x.Type, @"http://schemas.microsoft.com/identity/claims/objectidentifier")).FirstOrDefault()?.Value;
            return this.cardInventoryProvider.GetCardInventory(userId);
        }
    }
}
