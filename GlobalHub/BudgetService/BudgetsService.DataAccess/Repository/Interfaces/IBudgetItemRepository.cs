using BudgetsService.Infrastructure.Models;

namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface IBudgetItemRepository
{
    public IQueryable<BudgetItem> GetBudgetItemsByIdAndPeriodAsIQueryable(long budgetId, DateTimeRange datePeriod);
}
