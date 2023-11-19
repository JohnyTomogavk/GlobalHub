namespace BudgetsService.DataAccess.Repository;

public class BudgetRepository : IBudgetRepository
{
    private readonly ApplicationDbContext _dbContext;

    public BudgetRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // TODO: Add filter by user when users logic is implemented
    public async Task<IEnumerable<Budget?>> GetUserBudgetsAsync()
    {
        return await _dbContext.Budgets.ToListAsync();
    }

    public async Task<Budget?> GetBudgetByIdWithIncludeAsync(long id,
        params Expression<Func<Budget, object>>[] includes)
    {
        var query = _dbContext.Budgets.AsQueryable();
        var aggregate = includes.Aggregate(query, (current, includeExpression) => current.Include(includeExpression));

        return await aggregate.FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Budget?> GetBudgetByIdWithTagLimits(long budgetId)
    {
        return await _dbContext.Budgets.Include(budget => budget.BudgetTags).ThenInclude(tag => tag.TagLimit)
            .FirstOrDefaultAsync(budget => budget.Id == budgetId);
    }

    public async Task<Budget> AddBudget(Budget budget)
    {
        var createdEntity = await _dbContext.Budgets.AddAsync(budget);
        await _dbContext.SaveChangesAsync();

        return createdEntity.Entity;
    }

    public async Task<Budget> DeleteById(Budget budget)
    {
        var removedEntity = _dbContext.Budgets.Remove(budget).Entity;
        await _dbContext.SaveChangesAsync();

        return removedEntity;
    }

    public async Task<Budget> UpdateBudget(Budget budget)
    {
        var updatedBudget = _dbContext.Budgets.Update(budget).Entity;
        await _dbContext.SaveChangesAsync();

        return updatedBudget;
    }
}
