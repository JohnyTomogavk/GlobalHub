namespace FullTextSearchApi.Consumers.UpdateSearchItems;

public class UpdateBudgetSearchItemConsumer : BaseSearchItemUpdatedConsumer<UpdateBudgetSearchItem, BudgetSearchItem>
{
    public UpdateBudgetSearchItemConsumer(IElasticClient elasticClient, IMapper mapper)
        : base(elasticClient, mapper)
    {
    }

    protected override async Task<ISearchResponse<BudgetSearchItem>> GetIndexedSearchItemResponse(
        UpdateBudgetSearchItem updatedSearchItem)
    {
        var indexedSearchItem = await this._elasticClient.SearchAsync<BudgetSearchItem>(searchDescriptor =>
        {
            searchDescriptor.Index(this.SearchItemIndexName);
            searchDescriptor.Size(1);
            searchDescriptor.Query(query =>
            {
                query.Term(field: item => item.BudgetId, updatedSearchItem.BudgetId);

                return query;
            });

            return searchDescriptor;
        });

        return indexedSearchItem;
    }
}
