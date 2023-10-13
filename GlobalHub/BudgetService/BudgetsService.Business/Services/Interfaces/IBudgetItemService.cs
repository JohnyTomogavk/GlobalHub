namespace BudgetsService.Business.Services.Interfaces;

/// <summary>
/// Service that manages budget items
/// </summary>
public interface IBudgetItemService
{
    /// <summary>
    /// Gets budget items by budget id
    /// </summary>
    /// <param name="id">Budget id</param>
    /// <param name="queryOptions">Options with data for filtering, soring and ordering</param>
    /// <returns>Paginated budget item dto</returns>
    public Task<BudgetItemPaginatedResponse> GetBudgetItemsByBudgetId(long id,
        BudgetItemsQueryOptions queryOptions);

    /// <summary>
    /// Create new budget item
    /// </summary>
    /// <param name="createDto">Budget item data</param>
    /// <returns>Create budget item dto</returns>
    Task<BudgetItemDto> CreateBudgetItem(BudgetItemCreateDto createDto);

    /// <summary>
    /// Updates budget item's tags
    /// </summary>
    /// <param name="budgetItemId">Budget item id</param>
    /// <param name="tagsIds">Tag id's</param>
    /// <returns>Updated budget item dto</returns>
    Task<BudgetItemDto> UpdateBudgetItemTags(long budgetItemId, IEnumerable<long> tagsIds);

    /// <summary>
    /// Updates budget item
    /// </summary>
    /// <param name="updateDto">Budget item to update</param>
    /// <returns>Budget item data</returns>
    Task<BudgetItemDto> UpdateBudgetItem(BudgetItemUpdateDto updateDto);

    /// <summary>
    /// Deletes budget item by id
    /// </summary>
    /// <param name="budgetItemId">Budget item id</param>
    Task DeleteBudgetItem(long budgetItemId);

    /// <summary>
    /// Gets expenses sums grouped by tags
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="currentBudgetPeriod">Range to filter sums by</param>
    /// <returns>Set of sums dtos</returns>
    Task<IEnumerable<ExpenseOperationsSumDto>> GetExpensesSumsGroupedByTags(long budgetId,
        DateTimeRange currentBudgetPeriod);

    /// <summary>
    /// Gets budget items by budget id and date range
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="startDateRange">Start date range to filter budget items by</param>
    /// <param name="endDateRange">End date range to filter budget items by</param>
    /// <returns>Set of budget items dto</returns>
    Task<IEnumerable<BudgetItemDto>> GetBudgetItemsByIdAndRange(long budgetId, DateTime startDateRange,
        DateTime endDateRange);
}
