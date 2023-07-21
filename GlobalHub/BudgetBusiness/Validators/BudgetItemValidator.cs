using BudgetDataLayer.Constants;
using BudgetDataLayer.Entities.Budget;
using FluentValidation;

namespace BudgetBusinessLayer.Validators;

public class BudgetItemValidator : AbstractValidator<BudgetItem>
{
    public BudgetItemValidator()
    {
        RuleFor(e => e.ItemTitle)
            .NotEmpty()
            .MaximumLength(BudgetConstants.MaxBudgetItemTitleLength);

        RuleFor(e => e.ItemDescription)
            .NotEmpty()
            .MaximumLength(BudgetConstants.MaxBudgetItemDescriptionLength);

        RuleFor(e => e.BudgetOperationType).NotEqual(BudgetOperationType.Unknown);
    }
}
