using System;
using System.Linq;
using System.Security.Claims;

namespace KubeCards.Common
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal claimsPrincipal)
        {
            string userId = claimsPrincipal.Claims.Where(x => StringComparer.OrdinalIgnoreCase.Equals(x.Type, @"http://schemas.microsoft.com/identity/claims/objectidentifier")).FirstOrDefault()?.Value;
            return userId;
        }
    }
}
