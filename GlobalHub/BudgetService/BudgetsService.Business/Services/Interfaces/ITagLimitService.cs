namespace BudgetsService.Business.Services.Interfaces;

public interface ITagLimitService
{
    Task UpdateBudgetTagLimits(long budgetId, TagLimitsUpdateDto limitsUpdateDto);

    Task<IEnumerable<TagLimitDto>> GetTagLimits(long budgetId);
}
