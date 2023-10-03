namespace BudgetsService.Business.Validators.Tags;

public class TagLimitsValidator : AbstractValidator<TagLimitsUpdateDto>
{
    public TagLimitsValidator()
    {
        RuleForEach(dto => dto.TagLimitDtos)
            .ChildRules(t => t.RuleFor(dto => dto.MaxExpenseOperationsSum).InclusiveBetween(0, 100));
    }
}
