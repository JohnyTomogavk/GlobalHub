namespace Common.EventBus.Messages.FullTextSearchModels;

public class ProjectSearchItem : BaseSearchItem
{
    public string Title { get; set; }

    public long ProjectId { get; set; }

    public IEnumerable<string> Tags { get; set; }
}
