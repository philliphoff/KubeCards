using System.Net.Http;
using System.Net.Http.Headers;

namespace KubeCards.Common
{
    public static class HttpClientProvider
    {
        public static HttpClient GetHttpClient(string authToken)
        {
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            return httpClient;
        }
    }
}
