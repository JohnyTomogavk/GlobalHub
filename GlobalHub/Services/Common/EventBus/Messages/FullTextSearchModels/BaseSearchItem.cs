namespace Common.EventBus.Messages.FullTextSearchModels;

public class BaseSearchItem
{
    public string UserId { get; set; }

    public EEntityType EntityType { get; set; }
}
