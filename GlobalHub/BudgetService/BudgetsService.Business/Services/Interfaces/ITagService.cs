namespace BudgetsService.Business.Services.Interfaces;

public interface ITagService
{
    public Task<IEnumerable<TagDto>> GetBudgetTags(long budgetId);

    Task<TagDto> CreateNewTag(TagCreateDto newTagDto);
}
