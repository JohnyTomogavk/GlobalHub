using BudgetsService.DataAccess.Entities.Tags;

namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface ITagRepository
{
    public Task<IEnumerable<Tag>> AddTagsToBudgetItem(long budgetId, long[] tagIds);

    public Task<IEnumerable<Tag>> GetTagsByBudgetId(long budgetId);
}
