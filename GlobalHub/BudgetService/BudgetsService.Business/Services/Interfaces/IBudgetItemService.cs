namespace BudgetsService.Business.Services.Interfaces;

public interface IBudgetItemService
{
    public Task<BudgetItemPaginatedResponse> GetBudgetItemsByBudgetId(long id,
        BudgetItemsQueryOptions queryOptions);

    Task<BudgetItemDto> CreateBudgetItem(BudgetItemCreateDto createDto);

    Task<BudgetItemDto> UpdateBudgetItemTags(long budgetItemId, IEnumerable<long> tagsIds);

    Task<BudgetItemDto> UpdateBudgetItem(BudgetItemUpdateDto updateDto);

    Task DeleteBudgetItem(long budgetItemId);

    Task<IEnumerable<ExpenseOperationsSumDto>> GetExpensesSumsGroupedByTags(long budgetId,
        DateTimeRange currentBudgetPeriod);

    Task<IEnumerable<BudgetItemDto>> GetBudgetItemsByIdAndRange(long budgetId, DateTime startDateRange,
        DateTime endDateRange);
}
