using BudgetDataLayer.Entities.Base;
using BudgetDataLayer.Enums.Budget;
using BudgetDataLayer.Interface;

namespace BudgetDataLayer.Entities.Budget;

public class BudgetItem : BaseEntity, IHasDate
{
    public string ItemTitle { get; set; } = string.Empty;

    public string ItemDescription { get; set; } = string.Empty;

    public BudgetOperationType BudgetItemOperationType { get; set; }

    public BudgetItemRegularityType BudgetItemRegularityType { get; set; }

    public decimal BudgetOperationCost { get; set; }

    public DateTime PaymentDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual Budget Budget { get; set; }
}
