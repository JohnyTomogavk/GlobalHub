namespace Common.EventBus.Messages.FullTextSearchModels.Projects;

[JsonDerivedType(typeof(UpdateProjectSearchItem))]
[ElasticsearchType(IdProperty = nameof(ProjectId))]
public class ProjectSearchItem : BaseSearchItem
{
    [Text]
    public string Title { get; set; }

    [Number(NumberType.Long)]
    public long ProjectId { get; set; }

    [Text]
    public IEnumerable<string> Tags { get; set; }
}
