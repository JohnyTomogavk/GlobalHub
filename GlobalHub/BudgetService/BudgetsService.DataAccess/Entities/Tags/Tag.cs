namespace BudgetsService.DataAccess.Entities.Tags;

/// <summary>
/// Tag  classifies operation on budget
/// </summary>
public class Tag : BaseEntity
{
    /// <summary>
    /// Tag label
    /// </summary>
    public string Label { get; set; }

    /// <summary>
    /// Tag color
    /// </summary>
    public TagColor Color { get; set; }

    /// <summary>
    /// Related budget id
    /// </summary>
    public long BudgetId { get; set; }

    /// <summary>
    /// Related budget
    /// </summary>
    public virtual Budget Budget { get; set; }

    /// <summary>
    /// Related tag limits on the tag
    /// </summary>
    public virtual TagLimit? TagLimit { get; set; }

    /// <summary>
    /// Related budget item tags
    /// </summary>
    public virtual IEnumerable<BudgetItemTag> BudgetItemTags { get; set; } = new List<BudgetItemTag>();
}
