namespace FullTextSearchApi.Configs;

public static class ElasticSearchConfig
{
    public static async Task<IServiceCollection> ConfigureElasticSearch(this IServiceCollection serviceCollection)
    {
        var elasticSearchConnectionString = Environment.GetEnvironmentVariable("ELASTIC_SEARCH_URL");
        ArgumentException.ThrowIfNullOrEmpty(elasticSearchConnectionString);
        var elasticUri = new Uri(elasticSearchConnectionString);
        var connectionSettings = GetConnectionSettings(elasticUri);
        var client = new ElasticClient(connectionSettings);
        serviceCollection.AddSingleton<IElasticClient>(client);
        await ConfigureIndexes(client);

        return serviceCollection;
    }

    private static ConnectionSettings GetConnectionSettings(Uri connectionString)
    {
        return new ConnectionSettings(connectionString)
            .DefaultMappingFor<ProjectSearchItem>(s => s.IndexName(typeof(ProjectSearchItem).GetIndexName()))
            .DefaultMappingFor<ProjectItemSearchItem>(s => s.IndexName(typeof(ProjectItemSearchItem).GetIndexName()))
            .DefaultMappingFor<BudgetSearchItem>(s => s.IndexName(typeof(BudgetSearchItem).GetIndexName()))
            .DefaultMappingFor<BudgetItemSearchItem>(s => s.IndexName(typeof(BudgetItemSearchItem).GetIndexName()))
            .DefaultMappingFor<NoteSearchItem>(s => s.IndexName(typeof(NoteSearchItem).GetIndexName()));
    }

    private static async Task ConfigureIndexes(IElasticClient elasticClient)
    {
        await elasticClient.Indices.CreateAsync(typeof(ProjectSearchItem).GetIndexName(), c => c
            .Map<ProjectSearchItem>(m => m.AutoMap()));

        await elasticClient.Indices.CreateAsync(typeof(ProjectItemSearchItem).GetIndexName(), c => c
            .Map<ProjectItemSearchItem>(m => m.AutoMap()));

        await elasticClient.Indices.CreateAsync(typeof(BudgetSearchItem).GetIndexName(), c => c
            .Map<BudgetSearchItem>(m => m.AutoMap()));

        await elasticClient.Indices.CreateAsync(typeof(BudgetItemSearchItem).GetIndexName(), c => c
            .Map<BudgetItemSearchItem>(m => m.AutoMap()));

        await elasticClient.Indices.CreateAsync(typeof(NoteSearchItem).GetIndexName(), c => c
            .Map<NoteSearchItem>(m => m.AutoMap()));
    }
}
