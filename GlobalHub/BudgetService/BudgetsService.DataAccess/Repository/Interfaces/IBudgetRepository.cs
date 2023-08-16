using System.Linq.Expressions;
using BudgetsService.DataAccess.Entities.Budget;

namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget?>> GetUserBudgetsAsync();

    Task<Budget?> GetBudgetByIdWithIncludeAsync(long id, params Expression<Func<Budget, object>>[] includes);

    Task<Budget> AddBudget(Budget budget);
}
