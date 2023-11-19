namespace BudgetsService.DataAccess.Repository;

public class TagLimitRepository : ITagLimitRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TagLimitRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<TagLimit>> GetTagLimits(long budgetId)
    {
        return await _dbContext.TagLimits.Include(tagLimit => tagLimit.Tag)
            .Where(tl => tl.Tag.BudgetId == budgetId)
            .ToListAsync();
    }
}
