namespace BudgetsService.DataAccess.Repository.Interfaces;

/// <summary>
/// Repository that manages budget items
/// </summary>
public interface IBudgetItemRepository
{
    /// <summary>
    /// Returns IQueryable collection of budget items filtered by budget id
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>IQueryable set of budget items</returns>
    public IQueryable<BudgetItem> GetBudgetItemsByIdAndPeriodAsIQueryable(long budgetId);

    /// <summary>
    /// Create budget item
    /// </summary>
    /// <param name="createModel">Budget item's data</param>
    /// <returns>Created budget item</returns>
    Task<BudgetItem?> CreateBudgetItem(BudgetItem? createModel);

    /// <summary>
    /// Gets budget item by budget id
    /// </summary>
    /// <param name="budgetItemId">Budget item's id</param>
    /// <returns>Budget item</returns>
    Task<BudgetItem?> GetBudgetItemById(long budgetItemId);

    /// <summary>
    /// Gets budget items by budget id and date range
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="startDateRange">Start date to filter budget items by operation date</param>
    /// <param name="endDateRange">End date to filter budget items by operation date</param>
    /// <returns>Budget items</returns>
    Task<IEnumerable<BudgetItem>> GetBudgetItemsByIdAndDateRange(long budgetId, DateTime startDateRange,
        DateTime endDateRange);

    /// <summary>
    /// Update budget items
    /// </summary>
    /// <param name="entityToUpdate">Budget item to update</param>
    /// <returns>
    /// Updated budget item</returns>
    Task<BudgetItem> UpdateBudgetItem(BudgetItem entityToUpdate);

    /// <summary>
    /// Deletes budget item
    /// </summary>
    /// <param name="budgetItem">Budget item to delete</param>
    Task DeleteBudgetItemAsync(BudgetItem budgetItem);

    /// <summary>
    /// Returns budget item by id with specified included properties
    /// </summary>
    /// <param name="id">Budget item id</param>
    /// <param name="includes">Related properties that should be included to the model</param>
    /// <returns></returns>
    Task<BudgetItem?>
        GetBudgetItemByIdWithIncludeAsync(long id, params Expression<Func<BudgetItem, object>>[] includes);
}
