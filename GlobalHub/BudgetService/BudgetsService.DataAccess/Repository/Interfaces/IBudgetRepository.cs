namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget?>> GetUserBudgetsAsync();

    Task<Budget?> GetBudgetByIdWithIncludeAsync(long id, params Expression<Func<Budget, object>>[] includes);

    Task<Budget?> GetBudgetByIdWithTagLimits(long budgetId);

    Task<Budget> AddBudget(Budget budget);

    Task<Budget> DeleteById(long id);

    Task UpdateBudgetTitle(long budgetId, string title);

    Task UpdateBudgetDescription(long budgetId, string description);

    Task<Budget> UpdateBudget(Budget budget);
}
