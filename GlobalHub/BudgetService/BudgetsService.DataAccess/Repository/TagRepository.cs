namespace BudgetsService.DataAccess.Repository;

public class TagRepository : ITagRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TagRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<IEnumerable<Tag>> AddTagsToBudgetItem(long budgetId, long[] tagIds)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Tag>> GetTagsByBudgetId(long budgetId)
    {
        return await _dbContext.Tags.Where(tag => tag.BudgetId == budgetId).ToListAsync();
    }
}
