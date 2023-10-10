namespace BudgetsService.DataAccess.Repository;

public class BudgetItemRepository : IBudgetItemRepository
{
    private readonly ApplicationDbContext _dbContext;

    public BudgetItemRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<BudgetItem> GetBudgetItemsByIdAndPeriodAsIQueryable(long budgetId)
    {
        return _dbContext.BudgetsItems
            .Include(item => item.BudgetItemTags)
            .Where(item =>
                item.BudgetId == budgetId);
    }

    public async Task<BudgetItem?> CreateBudgetItem(BudgetItem? createModel)
    {
        var createdBudgetItem = (await _dbContext.BudgetsItems.AddAsync(createModel)).Entity;
        await _dbContext.SaveChangesAsync();

        return createdBudgetItem;
    }

    public async Task<BudgetItem> UpdateBudgetItemTags(long budgetItemId,
        IEnumerable<BudgetItemTag> budgetItemTags)
    {
        var budgetItem = await _dbContext.BudgetsItems.Include(item => item.BudgetItemTags)
            .FirstOrDefaultAsync(item => item.Id == budgetItemId);
        budgetItem.BudgetItemTags = budgetItemTags;
        await _dbContext.SaveChangesAsync();

        return budgetItem;
    }

    public async Task<BudgetItem?> GetBudgetItemById(long budgetItemId)
    {
        return await _dbContext.BudgetsItems.FirstOrDefaultAsync(item => item.Id == budgetItemId);
    }

    public async Task<IEnumerable<BudgetItem>> GetBudgetItemsByIdAndDateRange(long budgetId, DateTime startDateRange,
        DateTime endDateRange)
    {
        return await _dbContext.BudgetsItems.Where(bi =>
            bi.BudgetId == budgetId && bi.BudgetItemOperationType == BudgetItemOperationType.Outgoing &&
            bi.OperationDate >= startDateRange &&
            bi.OperationDate <= endDateRange).ToListAsync();
    }

    public async Task<BudgetItem> UpdateBudgetItem(BudgetItem entityToUpdate)
    {
        var updateEntity = _dbContext.BudgetsItems.Update(entityToUpdate).Entity;
        await _dbContext.SaveChangesAsync();

        return updateEntity;
    }

    public async Task DeleteBudgetItemAsync(BudgetItem budgetItem)
    {
        _dbContext.Remove(budgetItem);
        await _dbContext.SaveChangesAsync();
    }
}
