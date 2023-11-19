namespace BudgetsService.Business.Validators.Budgets;

public class UpdateBudgetPreservePercentValidator : AbstractValidator<UpdateBudgetPreservePercentDto>
{
    public UpdateBudgetPreservePercentValidator()
    {
        RuleFor(dto => dto.PreservePercent).InclusiveBetween(0, 100);
    }
}
