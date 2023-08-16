using BudgetsService.DataAccess.Entities.Base;
using BudgetsService.DataAccess.Enums.Budget;
using BudgetsService.DataAccess.Interface;

namespace BudgetsService.DataAccess.Entities.Budget;

public class BudgetItem : BaseEntity, IHasDate
{
    public string ItemTitle { get; set; } = string.Empty;

    public string ItemDescription { get; set; } = string.Empty;

    public BudgetItemOperationType BudgetItemOperationType { get; set; }

    public BudgetItemRegularityType BudgetItemRegularityType { get; set; }

    public decimal BudgetOperationCost { get; set; }

    public DateTime PaymentDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public long BudgetId { get; set; }
    
    public virtual Budget Budget { get; set; }
}
