using BudgetBusinessLayer.Dto.Budget;
using BudgetsService.Business.Dto.Budget;
using BudgetsService.Infrastructure.Models;

namespace BudgetsService.Business.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync();

    Task<BudgetDto> GetBudgetByIdAsync(long budgetId);

    Task<BudgetDto> AddBudgetAsync(CreateBudgetDto createBudgetDto);

    Task<BudgetAnalyticDto> GetBudgetAnalytic(long budgetId, DateTimeRange dateRange);

    Task<long> DeleteBudgetById(long id);
}
