namespace Common.EventBus.Messages.FullTextSearchModels.Notes;

[ElasticsearchType(IdProperty = nameof(NoteId))]
[JsonDerivedType(typeof(UpdateNoteSearchItem))]
public class NoteSearchItem : BaseSearchItem
{
    [Text] 
    public string Title { get; set; }

    public string NoteId { get; set; }

    /// <summary>
    /// Contains note's content in html format
    /// </summary>
    [Text(Analyzer = "html_analyzer")]
    public string Content { get; set; }
}
