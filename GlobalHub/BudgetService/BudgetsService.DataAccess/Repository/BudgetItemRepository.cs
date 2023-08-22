using BudgetsService.DataAccess.Context;
using BudgetsService.DataAccess.Entities.Budgets;
using BudgetsService.DataAccess.Repository.Interfaces;
using BudgetsService.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetsService.DataAccess.Repository;

public class BudgetItemRepository : IBudgetItemRepository
{
    private readonly ApplicationDbContext _dbContext;

    public BudgetItemRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<BudgetItem> GetBudgetItemsByIdAndPeriodAsIQueryable(long budgetId,
        DateTimeRange datePeriod)
    {
        return _dbContext.BudgetsItems
            .Include(item => item.BudgetItemTags)
            .Where(item =>
                item.BudgetId == budgetId);
    }
}
