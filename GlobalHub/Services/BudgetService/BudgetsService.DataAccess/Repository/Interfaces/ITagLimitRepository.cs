namespace BudgetsService.DataAccess.Repository.Interfaces;

/// <summary>
/// Repo that manages tag limits
/// </summary>
public interface ITagLimitRepository
{
    /// <summary>
    /// Gets tag limits for specified budget
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Set of tag limits</returns>
    Task<IEnumerable<TagLimit>> GetTagLimits(long budgetId);
}
