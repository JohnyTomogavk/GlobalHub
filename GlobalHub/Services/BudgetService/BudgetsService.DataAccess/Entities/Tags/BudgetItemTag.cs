namespace BudgetsService.DataAccess.Entities.Tags;

/// <summary>
/// Entity implementing many to many relations between tag and budget item
/// </summary>
public class BudgetItemTag : BaseEntity
{
    /// <summary>
    /// Related tag id
    /// </summary>
    public long TagId { get; set; }

    /// <summary>
    /// Related budget item ids
    /// </summary>
    public long BudgetItemId { get; set; }

    /// <summary>
    /// Related tag
    /// </summary>
    public virtual Tag Tag { get; set; }

    /// <summary>
    /// Related budget item
    /// </summary>
    public virtual BudgetItem BudgetItem { get; set; }
}
