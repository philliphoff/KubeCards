using System;

namespace KubeCards.Common
{
    public static class ObjectId
    {
        public static readonly string ComputerPlayerId = Guid.Empty.ToString("N").ToLowerInvariant();

        public static string GetNewId()
        {
            return Guid.NewGuid().ToString("N").ToLowerInvariant();
        }

        public static bool IsValidId(string id)
        {
            return Guid.TryParseExact(id, "N", out Guid _);
        }

        public static bool IdsMatch(string id1, string id2)
        {
            return StringComparer.OrdinalIgnoreCase.Equals(id1, id2);
        }
    }
}
