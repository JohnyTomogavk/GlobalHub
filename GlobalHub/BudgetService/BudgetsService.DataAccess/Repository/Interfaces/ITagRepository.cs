namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface ITagRepository
{
    Task<IEnumerable<Tag>> GetTagsByBudgetId(long budgetId);

    Task<Tag> CreateNewTag(Tag newTag);

    Task<Tag> UpdateTag(Tag tag);

    Task<Tag> GetTagById(long tagId);

    Task<long> DeleteById(long tagId);

    Task<Dictionary<long, decimal>> GetExpensesSumsGroupedByTags(long budgetId, DateTime startRangeDate,
        DateTime endRangeDate);
}
