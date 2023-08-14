using BudgetDataLayer.Entities.Base;

namespace BudgetDataLayer.Entities.Budget;

public class Tag : BaseEntity
{
    public string Label { get; set; }

    public string Color { get; set; }

    public virtual ICollection<BudgetItem> BudgetItems { get; set; } = new List<BudgetItem>();
}
