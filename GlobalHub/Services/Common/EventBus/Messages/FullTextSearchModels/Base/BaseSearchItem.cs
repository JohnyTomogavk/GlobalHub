namespace Common.EventBus.Messages.FullTextSearchModels.Base;

[ExcludeFromTopology]
public class BaseSearchItem
{
    public string UserId { get; set; }

    public EEntityType EntityType { get; set; }
}
