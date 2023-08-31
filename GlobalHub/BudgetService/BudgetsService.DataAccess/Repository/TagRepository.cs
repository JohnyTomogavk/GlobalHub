namespace BudgetsService.DataAccess.Repository;

public class TagRepository : ITagRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TagRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Tag>> GetTagsByBudgetId(long budgetId)
    {
        return await _dbContext.Tags.Where(tag => tag.BudgetId == budgetId).ToListAsync();
    }

    public async Task<Tag> CreateNewTag(Tag newTag)
    {
        var createdEntity = (await _dbContext.Tags.AddAsync(newTag)).Entity;
        await _dbContext.SaveChangesAsync();

        return createdEntity;
    }
}
