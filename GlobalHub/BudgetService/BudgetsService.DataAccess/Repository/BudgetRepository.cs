using System.Linq.Expressions;
using BudgetsService.DataAccess.Context;
using BudgetsService.DataAccess.Entities.Budgets;
using BudgetsService.DataAccess.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

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

    public async Task<Budget> AddBudget(Budget budget)
    {
        var createdEntity = await _dbContext.Budgets.AddAsync(budget);
        await _dbContext.SaveChangesAsync();

        return createdEntity.Entity;
    }

    public async Task<long> DeleteById(long id)
    {
        var budget = await _dbContext.Budgets.FirstOrDefaultAsync(budget => budget.Id == id);
        var removedEntity = _dbContext.Budgets.Remove(budget);
        await _dbContext.SaveChangesAsync();

        return removedEntity.Entity.Id;
    }
}
