namespace Common.EventBus.Messages.FullTextSearchModels.Projects;

[ElasticsearchType(IdProperty = nameof(ProjectItemId))]
[JsonDerivedType(typeof(UpdateProjectItemSearchItem))]
public class ProjectItemSearchItem : BaseSearchItem
{
    [Text]
    public string ProjectItemTitle { get; set; }

    [Text]
    public string ProjectTitle { get; set; }

    public long ProjectItemId { get; set; }

    public long ProjectId { get; set; }

    [Keyword(Normalizer = "lowercase")]
    public IEnumerable<string> Tags { get; set; }
}
