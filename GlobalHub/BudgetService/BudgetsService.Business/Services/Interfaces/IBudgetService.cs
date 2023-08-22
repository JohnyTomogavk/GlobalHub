namespace BudgetsService.Business.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync();

    Task<BudgetDto> GetBudgetByIdAsync(long budgetId);

    Task<BudgetDto> AddBudgetAsync(CreateBudgetDto createBudgetDto);

    Task<BudgetAnalyticDto> GetBudgetAnalytic(long budgetId, DateTimeRange dateRange);

    Task<Budget> DeleteBudgetById(long id);
}
