using BudgetsService.DataAccess.Entities.Budget;
using BudgetsService.Infrastructure.Models;

namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface IBudgetItemRepository
{
    public Task<ICollection<BudgetItem>> GetBudgetItemsByIdAndPeriod(long budgetId, DateTimeRange datePeriod);
}
