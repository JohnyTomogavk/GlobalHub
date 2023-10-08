namespace BudgetsService.DataAccess.Entities.Tags;

public class Tag : BaseEntity
{
    public string Label { get; set; }

    public TagColor Color { get; set; }

    public long BudgetId { get; set; }

    public virtual Budget Budget { get; set; }

    public virtual TagLimit? TagLimit { get; set; }

    public virtual IEnumerable<BudgetItemTag> BudgetItemTags { get; set; } = new List<BudgetItemTag>();
}
