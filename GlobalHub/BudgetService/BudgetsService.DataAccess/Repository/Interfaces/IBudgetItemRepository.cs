using BudgetsService.Infrastructure.Models;

namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface IBudgetItemRepository
{
    public IQueryable<BudgetItem> GetBudgetItemsByIdAndPeriodAsIQueryable(long budgetId, DateTimeRange datePeriod);

    Task<BudgetItem> CreateBudgetItem(BudgetItem createModel);

    Task<BudgetItem> UpdateBudgetItemTags(long budgetItemId, IEnumerable<BudgetItemTag> budgetItemTags);
}
