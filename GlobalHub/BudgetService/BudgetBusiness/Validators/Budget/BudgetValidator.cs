using BudgetDataLayer.Constants;
using FluentValidation;

namespace BudgetBusinessLayer.Validators.Budget;

public class BudgetValidator : AbstractValidator<BudgetDataLayer.Entities.Budget.Budget>
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
