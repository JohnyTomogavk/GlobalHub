using BudgetsService.DataAccess.Context;
using BudgetsService.DataAccess.Entities.Budget;
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

    public async Task<ICollection<BudgetItem>> GetBudgetItemsByIdAndPeriod(long budgetId, DateTimeRange datePeriod)
    {
        return await _dbContext.BudgetsItems.Where(item =>
                item.BudgetId == budgetId && item.PaymentDate >= datePeriod.StartRangeDate &&
                item.PaymentDate <= datePeriod.EndRangeDate)
            .ToListAsync();
    }
}
