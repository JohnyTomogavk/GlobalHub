using BudgetsService.Business.Dto.Tag;
using BudgetsService.DataAccess.Entities.Tags;

namespace BudgetsService.Business.Services.Interfaces;

public interface ITagService
{
    public Task<IEnumerable<TagDto>> GetBudgetTags(long budgetId);
}
