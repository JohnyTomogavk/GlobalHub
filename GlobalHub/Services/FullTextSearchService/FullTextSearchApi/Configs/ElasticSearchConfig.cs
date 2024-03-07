namespace FullTextSearchApi.Configs;

public static class ElasticSearchConfig
{
    public static IServiceCollection ConfigureElasticSearch(this IServiceCollection serviceCollection)
    {
        var elasticSearchConnectionString = Environment.GetEnvironmentVariable("ELASTIC_SEARCH_URL");
        ArgumentException.ThrowIfNullOrEmpty(elasticSearchConnectionString);
        var elasticUri = new Uri(elasticSearchConnectionString);
        var client = new ElasticsearchClient(new ElasticsearchClientSettings(elasticUri));
        serviceCollection.AddSingleton(client);

        return serviceCollection;
    }
}
