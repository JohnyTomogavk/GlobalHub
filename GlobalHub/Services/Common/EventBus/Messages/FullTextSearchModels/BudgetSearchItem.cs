namespace Common.EventBus.Messages.FullTextSearchModels;

public class BudgetSearchItem : BaseSearchItem
{
    public string Title { get; set; }

    public long BudgetId { get; set; }

    public IEnumerable<string> Tags { get; set; }
}
