namespace BudgetsService.Business.Services;

public class TagLimitService : ITagLimitService
{
    private readonly IValidator<TagLimitsUpdateDto> _tagLimitsUpdateDto;
    private readonly IBudgetRepository _budgetRepository;
    private readonly ITagLimitRepository _tagLimitRepository;
    private readonly IMapper _mapper;

    public TagLimitService(IValidator<TagLimitsUpdateDto> tagLimitsUpdateDto,
        IBudgetRepository budgetRepository,
        ITagLimitRepository tagLimitRepository,
        IMapper mapper)
    {
        _tagLimitsUpdateDto = tagLimitsUpdateDto;
        _budgetRepository = budgetRepository;
        _tagLimitRepository = tagLimitRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TagLimitDto>> GetTagLimits(long budgetId)
    {
        var tagLimits = await _tagLimitRepository.GetTagLimits(budgetId);

        return _mapper.Map<IEnumerable<TagLimitDto>>(tagLimits);
    }

    public async Task UpdateBudgetTagLimits(long budgetId, TagLimitsUpdateDto limitsUpdateDto)
    {
        var validationResult = await _tagLimitsUpdateDto.ValidateAsync(limitsUpdateDto);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var tagLimits = _mapper.Map<IEnumerable<TagLimit>>(limitsUpdateDto.TagLimitDtos);
        var budget = await _budgetRepository.GetBudgetByIdWithTagLimits(budgetId);

        if (budget == null)
        {
            throw new EntityNotFoundException("Budget not found");
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
