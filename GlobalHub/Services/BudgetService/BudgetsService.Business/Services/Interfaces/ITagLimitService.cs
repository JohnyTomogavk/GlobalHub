namespace BudgetsService.Business.Services.Interfaces;

/// <summary>
/// Service that manages tag limits
/// </summary>
public interface ITagLimitService
{
    /// <summary>
    /// Updates budget's tag limits
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="limitsUpdateDtos">Set of tag limits' dtos</param>
    Task UpdateBudgetTagLimits(long budgetId, IEnumerable<TagLimitDto> limitsUpdateDtos);

    /// <summary>
    /// Gets tag limits
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Set of tag limits dtos</returns>
    Task<IEnumerable<TagLimitDto>> GetTagLimits(long budgetId);
}
