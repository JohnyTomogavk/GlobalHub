using BudgetsService.DataAccess.Constants;
using BudgetsService.DataAccess.Entities.Budget;
using FluentValidation;

namespace BudgetsService.Business.Validators.Budgets;

public class BudgetValidator : AbstractValidator<Budget>
{
    public BudgetValidator()
    {
        RuleFor(e => e.BudgetTitle)
            .NotNull()
            .MaximumLength(BudgetConstants.MaxBudgetTitleLength);

        RuleFor(e => e.BudgetDescription)
            .NotNull()
            .MaximumLength(BudgetConstants.MaxBudgetDescriptionLength);
    }
}
