using BudgetsService.DataAccess.Entities.Base;
using BudgetsService.DataAccess.Entities.Budgets;

namespace BudgetsService.DataAccess.Entities.Tags;

public class Tag : BaseEntity
{
    public string Label { get; set; }

    public string Color { get; set; }

    public long BudgetId { get; set; }

    public Budget Budget { get; set; }

    public virtual IEnumerable<BudgetItemTag> BudgetItems { get; set; } = new List<BudgetItemTag>();
}
