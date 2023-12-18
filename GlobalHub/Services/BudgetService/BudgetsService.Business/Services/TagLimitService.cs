namespace BudgetsService.Business.Services;

public class TagLimitService : ITagLimitService
{
    private readonly IValidator<IEnumerable<TagLimitDto>> _tagLimitsUpdateValidator;
    private readonly IBudgetRepository _budgetRepository;
    private readonly ITagLimitRepository _tagLimitRepository;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService<Budget> _budgetAuthorizationService;
    private readonly IUserService _userService;

    public TagLimitService(IValidator<IEnumerable<TagLimitDto>> tagLimitsUpdateValidator,
        IBudgetRepository budgetRepository,
        ITagLimitRepository tagLimitRepository,
        IMapper mapper,
        IAuthorizationService<Budget> budgetAuthorizationService,
        IUserService userService)
    {
        _tagLimitsUpdateValidator = tagLimitsUpdateValidator;
        _budgetRepository = budgetRepository;
        _tagLimitRepository = tagLimitRepository;
        _mapper = mapper;
        _budgetAuthorizationService = budgetAuthorizationService;
        _userService = userService;
    }

    public async Task<IEnumerable<TagLimitDto>> GetTagLimits(long budgetId)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var tagLimits = await _tagLimitRepository.GetTagLimits(budgetId);

        return _mapper.Map<IEnumerable<TagLimitDto>>(tagLimits);
    }

    public async Task UpdateBudgetTagLimits(long budgetId, IEnumerable<TagLimitDto> limitsUpdateDtos)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var validationResult = await _tagLimitsUpdateValidator.ValidateAsync(limitsUpdateDtos);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var tagLimits = _mapper.Map<IEnumerable<TagLimit>>(limitsUpdateDtos);
        var budget = await _budgetRepository.GetBudgetByIdWithTagLimits(budgetId);

        if (budget == null)
        {
            throw new EntityNotFoundException("Budget is not found");
        }

        UpdateTagLimitsOnBudget(budget, tagLimits);
        await _budgetRepository.UpdateBudget(budget);
    }

    private void UpdateTagLimitsOnBudget(Budget budget, IEnumerable<TagLimit> tagLimits)
    {
        foreach (var tag in budget.BudgetTags)
        {
            var newTagLimit = tagLimits.SingleOrDefault(limit => limit.Id == tag.Id);
            tag.TagLimit = newTagLimit;
        }
    }
}
