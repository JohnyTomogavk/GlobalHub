namespace FullTextSearchApi.Consumers.UpdateSearchItems;

/// <summary>
/// Contains base logic of updating indexed documents on entity update
/// </summary>
/// <typeparam name="TConsumed">Type that handler consumes from event bus.</typeparam>
/// <typeparam name="TSearchItem">Type of indexed entity to update.</typeparam>
public abstract class BaseSearchItemUpdatedConsumer<TConsumed, TSearchItem> : IConsumer<TConsumed>
    where TSearchItem : BaseSearchItem
    where TConsumed : BaseSearchItem
{
    protected readonly IElasticClient _elasticClient;
    private readonly IMapper _mapper;
    protected readonly string SearchItemIndexName = typeof(TSearchItem).Name.ToLower();

    protected BaseSearchItemUpdatedConsumer(IElasticClient elasticClient, IMapper mapper)
    {
        this._elasticClient = elasticClient;
        this._mapper = mapper;
    }

    public async Task Consume(ConsumeContext<TConsumed> context)
    {
        var searchItemResponse = await this.GetIndexedSearchItemResponse(context.Message);

        if (!searchItemResponse.IsValid)
        {
            return;
        }

        var document = searchItemResponse.Documents.Single();
        var updatedDocument = this._mapper.Map(context.Message, document);
        var documentId = searchItemResponse.GetSingleDocumentId();

        await this._elasticClient.UpdateAsync<TSearchItem>(
            documentId,
            t => t.Index(this.SearchItemIndexName).Doc(updatedDocument));
    }

    protected abstract Task<ISearchResponse<TSearchItem>> GetIndexedSearchItemResponse(TConsumed updatedSearchItem);
}
