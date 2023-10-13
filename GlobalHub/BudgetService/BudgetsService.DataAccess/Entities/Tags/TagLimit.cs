namespace BudgetsService.DataAccess.Entities.Tags;

/// <summary>
/// Tag limit is used for setting limitation on expenses on tags
/// </summary>
public class TagLimit : BaseEntity
{
    /// <summary>
    /// Limit on expenses
    /// </summary>
    public decimal MaxExpenseOperationsSum { get; set; }

    /// <summary>
    /// Related tag
    /// </summary>
    public virtual Tag Tag { get; set; }
}
