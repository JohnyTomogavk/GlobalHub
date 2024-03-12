namespace FullTextSearchApi.Extensions;

public static class SearchResponseExtensions
{
    /// <summary>
    /// Gets document id (_id) from single-entity response
    /// </summary>
    /// <param name="response">Search response.</param>
    /// <typeparam name="T">Response type.</typeparam>
    /// <returns>Document id.</returns>
    public static string GetSingleDocumentId<T>(this ISearchResponse<T> response)
        where T : class
    {
        return response.Hits.Single().Id;
    }
}
