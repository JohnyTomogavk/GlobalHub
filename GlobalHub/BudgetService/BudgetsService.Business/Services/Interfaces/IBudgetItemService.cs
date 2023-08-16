using BudgetsService.DataAccess.Entities.Budget;
using BudgetsService.Infrastructure.Models;

namespace BudgetsService.Business.Services.Interfaces;

public interface IBudgetItemService
{
    public Task<ICollection<BudgetItem>> GetBudgetItemsByBudgetId(long id, DateTimeRange datePeriod);
}
