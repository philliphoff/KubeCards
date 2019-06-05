using Microsoft.AspNetCore.Http;
using System;

namespace KubeCards.Common
{
    public static class HttpRequestExtensions
    {
        public static string GetBearerAuthToken(this HttpRequest httpRequest)
        {
            string authToken = httpRequest.Headers["Authorization"];
            if (authToken.StartsWith("Bearer", StringComparison.OrdinalIgnoreCase))
            {
                authToken = authToken.Substring("Bearer".Length).Trim();
            }
            return authToken;
        }
    }
}
