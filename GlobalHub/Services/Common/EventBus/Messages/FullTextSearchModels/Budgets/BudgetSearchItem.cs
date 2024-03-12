namespace Common.EventBus.Messages.FullTextSearchModels.Budgets;

[ElasticsearchType(IdProperty = nameof(BudgetId))]
public class BudgetSearchItem : BaseSearchItem
{
    public string Title { get; set; }

    public long BudgetId { get; set; }
}
