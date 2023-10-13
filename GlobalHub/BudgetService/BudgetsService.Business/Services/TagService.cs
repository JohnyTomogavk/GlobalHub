namespace BudgetsService.Business.Services;

public class TagService : ITagService
{
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<TagCreateDto> _createTagValidator;

    public TagService(ITagRepository tagRepository, IMapper mapper, IValidator<TagCreateDto> createTagValidator)
    {
        _tagRepository = tagRepository;
        _mapper = mapper;
        _createTagValidator = createTagValidator;
    }

    public async Task<IEnumerable<TagDto>> GetBudgetTags(long budgetId)
    {
        var tags = await _tagRepository.GetTagsByBudgetId(budgetId);
        var tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);

        return tagDtos;
    }

    public async Task<TagDto> CreateNewTag(TagCreateDto newTagDto)
    {
        var result = await _createTagValidator.ValidateAsync(newTagDto);

        if (!result.IsValid)
        {
            throw new ValidationException(result.Errors);
        }

        var newTag = _mapper.Map<Tag>(newTagDto);
        var createdTag = await _tagRepository.CreateNewTag(newTag);
        var tagDto = _mapper.Map<TagDto>(createdTag);

        return tagDto;
    }

    public async Task<TagDto> UpdateTag(TagDto tagDto)
    {
        var tag = await _tagRepository.GetTagById(tagDto.Id);

        if (tag == null)
        {
            throw new EntityNotFoundException("Tag is not found");
        }

        var updatedTag = _mapper.Map(tagDto, tag);
        var updateTag = await _tagRepository.UpdateTag(updatedTag);

        return _mapper.Map<TagDto>(updateTag);
    }

    public async Task<long> DeleteTag(long tagId)
    {
        var tagToDelete = await _tagRepository.GetTagById(tagId);

        if (tagToDelete == null)
        {
            throw new EntityNotFoundException("Tag is not found");
        }

        return await _tagRepository.DeleteById(tagToDelete);
    }
}
