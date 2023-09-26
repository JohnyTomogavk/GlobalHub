namespace BudgetsService.Business.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync();

    Task<BudgetDto> GetBudgetByIdAsync(long budgetId);

    Task<BudgetDto> AddBudgetAsync(CreateBudgetDto createBudgetDto);

    Task<BudgetAnalyticDto> GetBudgetAnalytic(long budgetId, DateTimeRange dateRange);

    Task<Budget> DeleteBudgetById(long id);

    Task UpdateBudgetTitle(long budgetId, string title);

    Task UpdateBudgetDescription(long budgetId, string description);

    Task<Budget> UpdatePreservePercent(long budgetId, UpdateBudgetPreservePercentDto dto);
}
