namespace Common.EventBus.Messages.FullTextSearchModels.Budgets;

[ElasticsearchType(IdProperty = nameof(BudgetItemId))]
[JsonDerivedType(typeof(UpdateBudgetItemSearchItem))]
public class BudgetItemSearchItem : BaseSearchItem
{
    [Text]
    public string BudgetItemTitle { get; set; }
    
    [Text]
    public string BudgetTitle { get; set; }

    [Number(NumberType.Long)]
    public long BudgetItemId { get; set; }

    [Number(NumberType.Long)]
    public long BudgetId { get; set; }

    [Number(NumberType.Double)]
    public double OperationCost { get; set; }

    [Keyword(Normalizer = "lowercase")]
    public IEnumerable<string> Tags { get; set; }
}
