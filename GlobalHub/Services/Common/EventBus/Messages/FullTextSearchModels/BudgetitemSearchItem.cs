namespace Common.EventBus.Messages.FullTextSearchModels;

public class BudgetItemSearchItem : BaseSearchItem
{
    public string BudgetItemTitle { get; set; }

    public string BudgetTitle { get; set; }

    public long BudgetItemId { get; set; }

    public long BudgetId { get; set; }

    public double OperationCost { get; set; }

    public IEnumerable<string> Tags { get; set; }
}
