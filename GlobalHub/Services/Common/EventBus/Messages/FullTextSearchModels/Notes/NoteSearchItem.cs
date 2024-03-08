using Nest;

namespace Common.EventBus.Messages.FullTextSearchModels.Notes;

public class NoteSearchItem : BaseSearchItem
{
    public string Title { get; set; }

    public string NoteId { get; set; }

    /// <summary>
    /// Contains note's content in html format
    /// </summary>
    [Text(Analyzer = "html_stripper", Name = nameof(Content))]
    public string Content { get; set; }
}
