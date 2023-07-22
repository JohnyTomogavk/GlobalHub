using BudgetDataLayer.Data;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetDataLayer.Repository;

public class BudgetRepository : IBudgetRepository
{
    private readonly ApplicationDbContext _dbContext;

    public BudgetRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // TODO: Add filter by user when users logic is implemented
    public async Task<IEnumerable<Budget>> GetUserBudgetsAsync()
    {
        return await _dbContext.Budgets.ToListAsync();
    }
}
