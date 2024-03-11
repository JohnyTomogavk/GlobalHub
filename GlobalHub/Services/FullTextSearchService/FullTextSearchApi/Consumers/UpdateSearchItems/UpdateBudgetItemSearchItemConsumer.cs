namespace FullTextSearchApi.Consumers.UpdateSearchItems;

public class UpdateBudgetItemSearchItemConsumer :
    BaseSearchItemUpdatedConsumer<UpdateBudgetItemSearchItem, BudgetItemSearchItem>
{
    public UpdateBudgetItemSearchItemConsumer(IElasticClient elasticClient, IMapper mapper)
        : base(elasticClient, mapper)
    {
    }

    protected override async Task<ISearchResponse<BudgetItemSearchItem>> GetIndexedSearchItemResponse(
        UpdateBudgetItemSearchItem updatedSearchItem)
    {
        var indexedSearchItem = await this._elasticClient.SearchAsync<BudgetItemSearchItem>(searchDescriptor =>
        {
            searchDescriptor.Index(this.SearchItemIndexName);
            searchDescriptor.Size(1);
            searchDescriptor.Query(query =>
            {
                query.Term(field: item => item.BudgetItemId, updatedSearchItem.BudgetItemId);

                return query;
            });

            return searchDescriptor;
        });

        return indexedSearchItem;
    }
}
