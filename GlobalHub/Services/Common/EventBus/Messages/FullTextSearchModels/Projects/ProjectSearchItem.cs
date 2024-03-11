namespace Common.EventBus.Messages.FullTextSearchModels.Projects;

[ElasticsearchType(IdProperty = nameof(ProjectId))]
public class ProjectSearchItem : BaseSearchItem
{
    public string Title { get; set; }

    public long ProjectId { get; set; }

    public IEnumerable<string> Tags { get; set; }
}
