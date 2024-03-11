namespace FullTextSearchApi.Consumers.UpdateSearchItems;

public class UpdateProjectSearchItemConsumer :
    BaseSearchItemUpdatedConsumer<UpdateProjectSearchItem, ProjectSearchItem>
{
    public UpdateProjectSearchItemConsumer(IElasticClient elasticClient, IMapper mapper)
        : base(elasticClient, mapper)
    {
    }

    protected override async Task<ISearchResponse<ProjectSearchItem>> GetIndexedSearchItemResponse(
        UpdateProjectSearchItem updatedSearchItem)
    {
        var indexedSearchItem = await this._elasticClient.SearchAsync<ProjectSearchItem>(searchDescriptor =>
        {
            searchDescriptor.Index(this.SearchItemIndexName);
            searchDescriptor.Size(1);
            searchDescriptor.Query(query =>
            {
                query.Term(field: item => item.ProjectId, updatedSearchItem.ProjectId);

                return query;
            });

            return searchDescriptor;
        });

        return indexedSearchItem;
    }
}
