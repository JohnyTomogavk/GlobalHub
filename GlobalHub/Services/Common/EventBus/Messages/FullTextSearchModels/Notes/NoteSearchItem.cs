namespace Common.EventBus.Messages.FullTextSearchModels.Notes;

[ElasticsearchType(IdProperty = nameof(NoteId))]
[JsonDerivedType(typeof(UpdateNoteSearchItem))]
public class NoteSearchItem : BaseSearchItem
{
    [Text]
    public string Title { get; set; }

    public string NoteId { get; set; }

    /// <summary>
    /// Contains note's content in plain text format
    /// </summary>
    public string Content { get; set; }
}
