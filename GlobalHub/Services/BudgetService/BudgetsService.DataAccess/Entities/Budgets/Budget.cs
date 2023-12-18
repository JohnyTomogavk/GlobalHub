namespace BudgetsService.DataAccess.Entities.Budgets;

/// <summary>
/// User's budget. Contains common budget's config and info
/// </summary>
public class Budget : BaseEntity, IHasDate, IHasCreator
{
    /// <summary>
    /// Budget title
    /// </summary>
    public string BudgetTitle { get; set; } = string.Empty;

    /// <summary>
    /// Budget description
    /// </summary>
    public string BudgetDescription { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Preserve from incoming percent
    /// </summary>
    public int PreserveFromIncomingPercent { get; set; }

    /// <summary>
    /// Related budget item
    /// </summary>
    public virtual IEnumerable<BudgetItem> BudgetItems { get; set; } = new List<BudgetItem>();

    /// <summary>
    /// Related tags, that have been created in budget
    /// </summary>
    public virtual IEnumerable<Tag> BudgetTags { get; set; } = new List<Tag>();

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }
}
