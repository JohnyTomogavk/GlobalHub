namespace Common.EventBus.Messages.FullTextSearchModels;

public class ProjectItemSearchItem : BaseSearchItem
{
    public string ProjectItemTitle { get; set; }

    public string ProjectTitle { get; set; }

    public long ProjectItemId { get; set; }

    public long ProjectId { get; set; }

    public IEnumerable<string> Tags { get; set; }
}
