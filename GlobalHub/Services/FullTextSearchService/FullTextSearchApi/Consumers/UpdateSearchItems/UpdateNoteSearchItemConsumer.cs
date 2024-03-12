namespace FullTextSearchApi.Consumers.UpdateSearchItems;

public class UpdateNoteSearchItemConsumer : BaseSearchItemUpdatedConsumer<UpdateNoteSearchItem, NoteSearchItem>
{
    public UpdateNoteSearchItemConsumer(IElasticClient elasticClient, IMapper mapper)
        : base(elasticClient, mapper)
    {
    }

    protected override async Task<ISearchResponse<NoteSearchItem>> GetIndexedSearchItemResponse(
        UpdateNoteSearchItem updatedSearchItem)
    {
        var indexedNote = await this._elasticClient.SearchAsync<NoteSearchItem>(searchDescriptor =>
        {
            searchDescriptor.Index(this.SearchItemIndexName);
            searchDescriptor.Size(1);
            searchDescriptor.Query(query =>
            {
                query.Term(field: item => item.NoteId, updatedSearchItem.NoteId);

                return query;
            });

            return searchDescriptor;
        });

        return indexedNote;
    }
}
