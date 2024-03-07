namespace FullTextSearchApi.Consumers;

/// <summary>
/// Handles creations of entities that should be indexed in full-text index
/// </summary>
/// <typeparam name="TSearchItem">Type of created search item.</typeparam>
public class SearchItemCreatedConsumer<TSearchItem> : IConsumer<TSearchItem>
    where TSearchItem : BaseSearchItem
{
    private readonly ElasticsearchClient _elasticsearchClient;

    public SearchItemCreatedConsumer(ElasticsearchClient elasticsearchClient)
    {
        this._elasticsearchClient = elasticsearchClient;
    }

    public async Task Consume(ConsumeContext<TSearchItem> context)
    {
        await this._elasticsearchClient.IndexAsync(
            context.Message,
            descriptor => descriptor.Index(typeof(TSearchItem).Name.ToLower()));
    }
}
