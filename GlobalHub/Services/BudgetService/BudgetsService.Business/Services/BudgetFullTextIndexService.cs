namespace BudgetsService.Business.Services;

public class BudgetFullTextIndexService : IFullTextIndexService<Budget>
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _dbContext;

    public BudgetFullTextIndexService(IPublishEndpoint publishEndpoint, IMapper mapper, ApplicationDbContext dbContext)
    {
        this._publishEndpoint = publishEndpoint;
        this._mapper = mapper;
        this._dbContext = dbContext;
    }

    public async Task IndexCreatedEntity(long budgetId)
    {
        var budget = await this._dbContext.Budgets.SingleOrDefaultAsync(t => t.Id == budgetId);
        var searchItem = this._mapper.Map<BudgetSearchItem>(budget);
        await this._publishEndpoint.Publish(searchItem);
    }

    public async Task UpdateIndexedEntity(long budgetId)
    {
        var budget = await this._dbContext.Budgets.SingleOrDefaultAsync(t => t.Id == budgetId);
        var searchItem = this._mapper.Map<UpdateBudgetSearchItem>(budget);
        await this._publishEndpoint.Publish(searchItem);
    }

    public Task RemoveEntityFromIndex(long budgetId)
    {
        throw new NotImplementedException();
    }
}
