namespace BudgetsService.Business.Validators.Tags;

public class TagLimitsValidator : AbstractValidator<IEnumerable<TagLimitDto>>
{
    public TagLimitsValidator()
    {
        RuleForEach(dto => dto)
            .ChildRules(t => t.RuleFor(dto => dto.MaxExpenseOperationsSum).GreaterThan(new decimal(0.1)));
    }
}
