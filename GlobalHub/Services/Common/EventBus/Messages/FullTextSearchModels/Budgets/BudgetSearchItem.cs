namespace Common.EventBus.Messages.FullTextSearchModels.Budgets;

[ElasticsearchType(IdProperty = nameof(BudgetId))]
[JsonDerivedType(typeof(UpdateBudgetSearchItem))]
public class BudgetSearchItem : BaseSearchItem
{
    [Text]
    public string Title { get; set; }

    public long BudgetId { get; set; }
}
