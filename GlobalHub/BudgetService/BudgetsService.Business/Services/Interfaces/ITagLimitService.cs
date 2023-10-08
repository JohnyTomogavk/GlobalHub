namespace BudgetsService.Business.Services.Interfaces;

public interface ITagLimitService
{
    Task UpdateBudgetTagLimits(long budgetId, IEnumerable<TagLimitDto> limitsUpdateDtos);

    Task<IEnumerable<TagLimitDto>> GetTagLimits(long budgetId);
}
