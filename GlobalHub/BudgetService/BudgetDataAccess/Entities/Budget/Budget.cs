using BudgetDataLayer.Entities.Base;
using BudgetDataLayer.Interface;

namespace BudgetDataLayer.Entities.Budget;

public class Budget : BaseEntity, IHasDate
{
    public string BudgetTitle { get; set; } = string.Empty;

    public string BudgetDescription { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public int PreserveFromIncomingPercent { get; set; }

    public virtual ICollection<BudgetItem> BudgetItems { get; set; } = new List<BudgetItem>();
}
