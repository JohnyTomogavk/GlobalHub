namespace BudgetsService.DataAccess.Repository.Interfaces;

/// <summary>
/// Repository that manages budgets
/// </summary>
public interface IBudgetRepository
{
    /// <summary>
    /// Gets user's budgets
    /// </summary>
    /// <returns>User's budgets</returns>
    Task<IEnumerable<Budget?>> GetUserBudgetsAsync();

    /// <summary>
    /// Gets budget by budget id with specified includes
    /// </summary>
    /// <param name="id">Budget id</param>
    /// <param name="includes">Set of includes expressions</param>
    /// <returns>Budget</returns>
    Task<Budget?> GetBudgetByIdWithIncludeAsync(long id, params Expression<Func<Budget, object>>[] includes);

    /// <summary>
    /// Gets budget including related tag limits data
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Budget</returns>
    Task<Budget?> GetBudgetByIdWithTagLimits(long budgetId);

    /// <summary>
    /// Creates new budget
    /// </summary>
    /// <param name="budget">New budget data</param>
    /// <returns>Created budget</returns>
    Task<Budget> AddBudget(Budget budget);

    /// <summary>
    /// Deletes budget
    /// </summary>
    /// <param name="id">Budget id</param>
    /// <returns>Deleted budget's id</returns>
    Task<Budget> DeleteById(long id);

    /// <summary>
    /// Updates budget title
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="title">New title</param>
    Task UpdateBudgetTitle(long budgetId, string title);

    /// <summary>
    /// Updates budget description
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="description">New description</param>
    Task UpdateBudgetDescription(long budgetId, string description);

    /// <summary>
    /// Updates budget
    /// </summary>
    /// <param name="budget">Budget to update</param>
    /// <returns>Updated budget</returns>
    Task<Budget> UpdateBudget(Budget budget);
}
