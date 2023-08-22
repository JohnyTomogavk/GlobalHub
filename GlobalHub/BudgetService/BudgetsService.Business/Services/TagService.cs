using AutoMapper;
using BudgetsService.Business.Dto.Tag;
using BudgetsService.Business.Services.Interfaces;
using BudgetsService.DataAccess.Repository.Interfaces;

namespace BudgetsService.Business.Services;

public class TagService : ITagService
{
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;

    public TagService(ITagRepository tagRepository, IMapper mapper)
    {
        _tagRepository = tagRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TagDto>> GetBudgetTags(long budgetId)
    {
        var tags = await _tagRepository.GetTagsByBudgetId(budgetId);
        var tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);

        return tagDtos;
    }
}
