namespace BudgetsService.Business.Services;

public class BudgetAuthorizationService : IAuthorizationService<Budget>
{
    public BudgetAuthorizationService(ApplicationDbContext dbContext)
    {
        Entities = dbContext.Budgets;
    }

    private DbSet<Budget> Entities { get; }

    public async Task<bool> AuthorizeRead(string userId, IEnumerable<long> entityIds)
    {
        var budgets = await Entities.Where(budget => entityIds.Contains(budget.Id)).ToListAsync();

        return budgets.All(budget => budget.CreatedBy == userId);
    }

    public async Task<bool> AuthorizeRead(string userId, long entityId)
    {
        var budget = await Entities.FindAsync(entityId);

        return budget?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeUpdate(string userId, long entityId)
    {
        var budget = await Entities.FindAsync(entityId);

        return budget?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeDelete(string userId, long entityId)
    {
        var budget = await Entities.FindAsync(entityId);

        return budget?.CreatedBy == userId;
    }
}
