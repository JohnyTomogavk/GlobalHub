namespace FullTextSearchApi.Consumers;

/// <summary>
/// Handles creations of entities that should be indexed in full-text index
/// </summary>
/// <typeparam name="TSearchItem">Type of created search item.</typeparam>
public class SearchItemCreatedConsumer<TSearchItem> : IConsumer<TSearchItem>
    where TSearchItem : BaseSearchItem
{
    private readonly IElasticClient _elasticClient;

    public SearchItemCreatedConsumer(IElasticClient elasticClient)
    {
        this._elasticClient = elasticClient;
    }

    public async Task Consume(ConsumeContext<TSearchItem> context)
    {
        await this._elasticClient.IndexAsync(
            context.Message,
            descriptor => descriptor.Index(typeof(TSearchItem).Name.ToLower()));
    }
}
