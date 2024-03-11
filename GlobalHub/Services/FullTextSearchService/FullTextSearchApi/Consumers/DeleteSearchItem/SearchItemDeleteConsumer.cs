namespace FullTextSearchApi.Consumers.DeleteSearchItem;

/// <summary>
/// Consumer for removing document with _id, that is equal to provided, from index named as TSearchItem
/// </summary>
/// <typeparam name="TData">Contains data of document.</typeparam>
/// <typeparam name="TSearchItem">Type to calculate index name.</typeparam>
public class SearchItemDeleteConsumer<TData, TSearchItem> : IConsumer<TData>
    where TData : DeleteSearchItemBase<TSearchItem>
    where TSearchItem : BaseSearchItem
{
    private readonly IElasticClient _elasticClient;
    private string _indexName = typeof(TSearchItem).Name.ToLower();

    public SearchItemDeleteConsumer(IElasticClient elasticClient)
    {
        this._elasticClient = elasticClient;
    }

    public async Task Consume(ConsumeContext<TData> context)
    {
        var documentIds = context.Message.DocumentIds;

        await this._elasticClient.DeleteByQueryAsync<TSearchItem>(d =>
        {
            d.Index(this._indexName);
            d.Query(q => q.Ids(ids => ids.Values(documentIds)));

            return d;
        });
    }
}
