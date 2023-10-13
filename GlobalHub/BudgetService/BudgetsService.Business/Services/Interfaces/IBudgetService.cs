namespace BudgetsService.Business.Services.Interfaces;

/// <summary>
/// Service that manages budgets
/// </summary>
public interface IBudgetService
{
    /// <summary>
    /// Gets map of user's budgets
    /// </summary>
    /// <returns>Set of maps</returns>
    Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync();

    /// <summary>
    /// Gets budget by id
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Budget dto</returns>
    Task<BudgetDto> GetBudgetByIdAsync(long budgetId);

    /// <summary>
    /// Creates new budget
    /// </summary>
    /// <param name="createBudgetDto">New budget data</param>
    /// <returns>Create budget dto</returns>
    Task<BudgetDto> AddBudgetAsync(CreateBudgetDto createBudgetDto);

    /// <summary>
    /// Gets analytic on current budget status
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="dateRange">Date range to perform analytic by</param>
    /// <returns>Budget analytic data</returns>
    Task<BudgetAnalyticDto> GetBudgetAnalytic(long budgetId, DateTimeRange dateRange);

    /// <summary>
    /// Deletes budget by id
    /// </summary>
    /// <param name="id">Budget id</param>
    /// <returns>Deleted budget's id</returns>
    Task<long> DeleteBudgetById(long id);

    /// <summary>
    /// Update budget title
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="title">New title</param>
    Task UpdateBudgetTitle(long budgetId, string title);

    /// <summary>
    /// Update budget description
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="description">New description</param>
    Task UpdateBudgetDescription(long budgetId, string description);

    /// <summary>
    /// Updates preserve from incoming percent
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="dto">Preserve percent data</param>
    /// <returns>Update budget dto</returns>
    Task<BudgetDto> UpdatePreservePercent(long budgetId, UpdateBudgetPreservePercentDto dto);
}
