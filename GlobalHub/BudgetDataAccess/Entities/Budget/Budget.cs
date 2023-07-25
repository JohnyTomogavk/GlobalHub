using BudgetDataLayer.Entities.Base;

namespace BudgetDataLayer.Entities.Budget;

public class Budget : BaseEntity
{
    public string BudgetTitle { get; set; } = string.Empty;

    public string BudgetDescription { get; set; } = string.Empty;

    public virtual ICollection<BudgetItem> BudgetItems { get; set; } = new List<BudgetItem>();
}
