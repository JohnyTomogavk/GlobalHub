namespace Common.EventBus.Messages.FullTextSearchModels.Base;

[ExcludeFromTopology]
[JsonDerivedType(typeof(ProjectSearchItem))]
[JsonDerivedType(typeof(ProjectItemSearchItem))]
[JsonDerivedType(typeof(BudgetSearchItem))]
[JsonDerivedType(typeof(BudgetItemSearchItem))]
[JsonDerivedType(typeof(NoteSearchItem))]
public class BaseSearchItem
{
    [Keyword] public string UserId { get; set; }

    public EEntityType EntityType { get; set; }
}
