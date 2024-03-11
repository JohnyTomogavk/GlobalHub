namespace BudgetsService.Business.Services;

public class BudgetItemFullTextIndexService : IFullTextIndexService<BudgetItem>
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _dbContext;

    public BudgetItemFullTextIndexService(
        IPublishEndpoint publishEndpoint,
        IMapper mapper,
        ApplicationDbContext dbContext)
    {
        this._publishEndpoint = publishEndpoint;
        this._mapper = mapper;
        this._dbContext = dbContext;
    }

    public async Task IndexCreatedEntity(long entityId)
    {
        var budget = await GetBudgetItem(entityId);
        var searchItem = this._mapper.Map<BudgetItemSearchItem>(budget);
        await this._publishEndpoint.Publish(searchItem);
    }

    public async Task UpdateIndexedEntity(long entityId)
    {
        var budget = await GetBudgetItem(entityId);
        var searchItem = this._mapper.Map<UpdateBudgetItemSearchItem>(budget);
        await this._publishEndpoint.Publish(searchItem);
    }

    public Task RemoveEntityFromIndex(long entityId)
    {
        throw new NotImplementedException();
    }

    private async Task<BudgetItem?> GetBudgetItem(long budgetItemId)
    {
        return await this._dbContext.BudgetsItems
            .Include(t => t.BudgetItemTags)
            .ThenInclude(t => t.Tag)
            .SingleOrDefaultAsync(t => t.Id == budgetItemId);
    }
}
