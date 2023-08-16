using BudgetsService.Business.Services.Interfaces;
using BudgetsService.DataAccess.Entities.Budget;
using BudgetsService.DataAccess.Repository.Interfaces;
using BudgetsService.Infrastructure.Models;

namespace BudgetsService.Business.Services;

public class BudgetItemService : IBudgetItemService
{
    private readonly IBudgetItemRepository _budgetItemRepository;

    public BudgetItemService(IBudgetItemRepository budgetItemRepository)
    {
        _budgetItemRepository = budgetItemRepository;
    }

    public async Task<ICollection<BudgetItem>> GetBudgetItemsByBudgetId(long id, DateTimeRange datePeriod)
    {
        return await _budgetItemRepository.GetBudgetItemsByIdAndPeriod(id, datePeriod);
    }
}
