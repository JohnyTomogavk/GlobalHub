using BudgetsService.DataAccess.Enums.Tags;

namespace BudgetsService.DataAccess.Entities.Tags;

public class Tag : BaseEntity
{
    public string Label { get; set; }

    public TagColor Color { get; set; }

    public long BudgetId { get; set; }

    public Budget Budget { get; set; }

    public virtual IEnumerable<BudgetItemTag> BudgetItems { get; set; } = new List<BudgetItemTag>();
}
