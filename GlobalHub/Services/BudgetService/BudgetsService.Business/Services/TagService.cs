namespace BudgetsService.Business.Services;

public class TagService : ITagService
{
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<TagCreateDto> _createTagValidator;
    private readonly IAuthorizationService<Budget> _budgetAuthorizationService;
    private readonly IUserService _userService;

    public TagService(ITagRepository tagRepository,
        IMapper mapper,
        IValidator<TagCreateDto> createTagValidator,
        IAuthorizationService<Budget> budgetAuthorizationService,
        IUserService userService)
    {
        _tagRepository = tagRepository;
        _mapper = mapper;
        _createTagValidator = createTagValidator;
        _budgetAuthorizationService = budgetAuthorizationService;
        _userService = userService;
    }

    public async Task<IEnumerable<TagDto>> GetBudgetTags(long budgetId)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var tags = await _tagRepository.GetTagsByBudgetId(budgetId);
        var tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);

        return tagDtos;
    }

    public async Task<TagDto> CreateNewTag(TagCreateDto newTagDto)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, newTagDto.BudgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

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

        var authorized =
            await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, tag.BudgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

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

        var authorized =
            await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, tagToDelete.BudgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        if (tagToDelete == null)
        {
            throw new EntityNotFoundException("Tag is not found");
        }

        return await _tagRepository.DeleteById(tagToDelete);
    }
}
