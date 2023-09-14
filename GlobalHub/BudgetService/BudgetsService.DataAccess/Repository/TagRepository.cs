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

    public async Task<Tag> UpdateTag(Tag tag)
    {
        var updatedTag = _dbContext.Tags.Update(tag).Entity;
        await _dbContext.SaveChangesAsync();

        return updatedTag;
    }

    public async Task<Tag> GetTagById(long tagId)
    {
        return await _dbContext.Tags.FirstOrDefaultAsync(tag => tag.Id == tagId);
    }

    public async Task<long> DeleteById(long tagId)
    {
        var tag = await _dbContext.Tags.FirstOrDefaultAsync(tag => tag.Id == tagId);
        _dbContext.Tags.Remove(tag);
        await _dbContext.SaveChangesAsync();

        return tagId;
    }
}
