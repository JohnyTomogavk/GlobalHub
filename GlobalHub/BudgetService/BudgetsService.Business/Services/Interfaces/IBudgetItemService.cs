namespace BudgetsService.Business.Services.Interfaces;

public interface IBudgetItemService
{
    public Task<BudgetItemPaginatedResponse> GetBudgetItemsByBudgetId(long id, DateTimeRange datePeriod,
        BudgetItemsQueryOptions queryOptions);
}
