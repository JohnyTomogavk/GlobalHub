namespace BudgetsService.DataAccess.Entities.Budgets;

public class BudgetItem : BaseEntity, IHasDate
{
    public string ItemTitle { get; set; } = string.Empty;

    public string ItemDescription { get; set; } = string.Empty;

    public BudgetItemOperationType BudgetItemOperationType { get; set; }

    public BudgetItemRegularityType BudgetItemRegularityType { get; set; }

    // TODO: Rename to OperationCost
    public decimal BudgetOperationCost { get; set; }

    // TODO: Rename to operation date // maybe optional
    public DateTime PaymentDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual IEnumerable<BudgetItemTag> BudgetItemTags { get; set; } = new List<BudgetItemTag>();

    public long BudgetId { get; set; }

    public virtual Budget Budget { get; set; }
}
