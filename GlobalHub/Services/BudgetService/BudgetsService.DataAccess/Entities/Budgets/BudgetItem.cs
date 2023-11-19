namespace BudgetsService.DataAccess.Entities.Budgets;

/// <summary>
/// Budget item is operation on budget
/// </summary>
public class BudgetItem : BaseEntity, IHasDate
{
    /// <summary>
    /// Operation title
    /// </summary>
    public string ItemTitle { get; set; } = string.Empty;

    /// <summary>
    /// Operation description
    /// </summary>
    public string? ItemDescription { get; set; } = string.Empty;

    /// <summary>
    /// Operation type - incoming / outgoing
    /// </summary>
    public BudgetItemOperationType BudgetItemOperationType { get; set; }

    /// <summary>
    /// Operation regularity type
    /// </summary>
    public BudgetItemRegularityType BudgetItemRegularityType { get; set; }

    /// <summary>
    /// Operation cost
    /// </summary>
    public decimal OperationCost { get; set; }

    /// <summary>
    /// The date when operation was done
    /// </summary>
    public DateTime OperationDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Related budget item tags
    /// </summary>
    public virtual IEnumerable<BudgetItemTag> BudgetItemTags { get; set; } = new List<BudgetItemTag>();

    /// <summary>
    /// Related budget id
    /// </summary>
    public long BudgetId { get; set; }

    /// <summary>
    /// Related budget
    /// </summary>
    public virtual Budget Budget { get; set; }
}
