namespace FullTextSearchApi.Consumers.UpdateSearchItems;

public class UpdateProjectItemSearchItemConsumer : BaseSearchItemUpdatedConsumer
    <UpdateProjectItemSearchItem, ProjectItemSearchItem>
{
    public UpdateProjectItemSearchItemConsumer(IElasticClient elasticClient, IMapper mapper)
        : base(elasticClient, mapper)
    {
    }

    protected override async Task<ISearchResponse<ProjectItemSearchItem>> GetIndexedSearchItemResponse(
        UpdateProjectItemSearchItem updatedSearchItem)
    {
        var indexedSearchItem = await this._elasticClient.SearchAsync<ProjectItemSearchItem>(searchDescriptor =>
        {
            searchDescriptor.Index(this.SearchItemIndexName);
            searchDescriptor.Size(1);
            searchDescriptor.Query(query =>
            {
                query.Term(field: item => item.ProjectItemId, updatedSearchItem.ProjectItemId);

                return query;
            });

            return searchDescriptor;
        });

        return indexedSearchItem;
    }
}
