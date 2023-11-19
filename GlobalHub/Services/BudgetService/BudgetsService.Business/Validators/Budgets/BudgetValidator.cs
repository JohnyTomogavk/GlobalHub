namespace BudgetsService.Business.Validators.Budgets;

public class BudgetValidator : AbstractValidator<Budget>
{
    public BudgetValidator()
    {
        RuleFor(e => e.BudgetTitle)
            .NotEmpty()
            .MaximumLength(BudgetConstants.MaxBudgetTitleLength);

        RuleFor(e => e.BudgetDescription)
            .NotNull()
            .MaximumLength(BudgetConstants.MaxBudgetDescriptionLength);
    }
}
