namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface ITagRepository
{
    public Task<IEnumerable<Tag>> GetTagsByBudgetId(long budgetId);

    Task<Tag> CreateNewTag(Tag newTag);
}
