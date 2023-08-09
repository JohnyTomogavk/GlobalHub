using BudgetBusinessLayer.Dto.Budget;
using BudgetDataLayer.Entities.Budget;

namespace BudgetBusinessLayer.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync();

    Task<BudgetDto> GetBudgetByIdAsync(long budgetId);

    Task<BudgetDto> AddBudgetAsync(CreateBudgetDto createBudgetDto);
}
