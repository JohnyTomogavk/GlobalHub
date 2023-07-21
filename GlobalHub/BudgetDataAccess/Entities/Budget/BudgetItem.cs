using BudgetDataLayer.Entities.Base;

namespace BudgetDataLayer.Entities.Budget;

public class BudgetItem : BaseEntity
{
    public string ItemTitle { get; set; } = string.Empty;

    public string ItemDescription { get; set; } = string.Empty;

    public BudgetOperationType BudgetOperationType { get; set; }
    
    public decimal BudgetOperationCost { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual Budget Budget { get; set; }
}
