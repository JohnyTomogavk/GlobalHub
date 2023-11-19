namespace BudgetsService.DataAccess.Repository;

public class TagRepository : ITagRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TagRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Tag?>> GetTagsByBudgetId(long budgetId)
    {
        return await _dbContext.Tags.Where(tag => tag.BudgetId == budgetId).ToListAsync();
    }

    public async Task<Tag?> CreateNewTag(Tag? newTag)
    {
        var createdEntity = (await _dbContext.Tags.AddAsync(newTag)).Entity;
        await _dbContext.SaveChangesAsync();

        return createdEntity;
    }

    public async Task<Tag?> UpdateTag(Tag? tag)
    {
        var updatedTag = _dbContext.Tags.Update(tag).Entity;
        await _dbContext.SaveChangesAsync();

        return updatedTag;
    }

    public async Task<Tag?> GetTagById(long tagId)
    {
        return await _dbContext.Tags.FirstOrDefaultAsync(tag => tag.Id == tagId);
    }

    public async Task<long> DeleteById(Tag tag)
    {
        _dbContext.Tags.Remove(tag);
        await _dbContext.SaveChangesAsync();

        return tag.Id;
    }

    public async Task<Dictionary<long, decimal>> GetExpensesSumsGroupedByTags(long budgetId, DateTime startRangeDate,
        DateTime endRangeDate)
    {
        var grouped = await _dbContext.Tags
            .Include(tag => tag.BudgetItemTags)
            .ThenInclude(biTag => biTag.BudgetItem)
            .Where(tag => tag.BudgetId == budgetId)
            .Select(tag => new
            {
                TagId = tag.Id,
                OperationCostsSum = tag.BudgetItemTags
                    .Where(itemTag =>
                        itemTag.BudgetItem.BudgetItemOperationType == BudgetItemOperationType.Outgoing &&
                        itemTag.BudgetItem.OperationDate.Date >= startRangeDate.Date &&
                        itemTag.BudgetItem.OperationDate.Date <= endRangeDate.Date)
                    .Sum(bi => bi.BudgetItem.OperationCost)
            })
            .ToDictionaryAsync(t => t.TagId, arg => arg.OperationCostsSum);

        return grouped;
    }
}
