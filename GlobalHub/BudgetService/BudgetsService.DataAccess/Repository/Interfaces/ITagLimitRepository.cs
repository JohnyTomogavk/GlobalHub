namespace BudgetsService.DataAccess.Repository.Interfaces;

public interface ITagLimitRepository
{
    Task<IEnumerable<TagLimit>> GetTagLimits(long budgetId);
}
