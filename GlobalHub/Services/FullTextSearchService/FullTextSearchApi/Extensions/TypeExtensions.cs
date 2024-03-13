namespace FullTextSearchApi.Extensions;

public static class TypeExtensions
{
    /// <summary>
    /// Returns index name for provided type
    /// </summary>
    /// <param name="type">Type to get index name for.</param>
    /// <returns>Index name.</returns>
    public static string GetIndexName(this Type type)
    {
        return type.Name.ToLower();
    }
}
