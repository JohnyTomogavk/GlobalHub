using BudgetDataLayer.Constants;
using BudgetDataLayer.Entities.Budget;
using FluentValidation;

namespace BudgetBusinessLayer.Validators;

public class BudgetValidator : AbstractValidator<Budget>
{
    public BudgetValidator()
    {
        RuleFor(e => e.BudgetTitle)
            .NotEmpty()
            .MaximumLength(BudgetConstants.MaxBudgetTitleLength);

        RuleFor(e => e.BudgetDescription)
            .NotEmpty()
            .MaximumLength(BudgetConstants.MaxBudgetDescriptionLength);
    }
}
