using BudgetDataLayer.Constants;
using BudgetDataLayer.Entities.Budget;
using FluentValidation;

namespace BudgetBusinessLayer.Validators.Budgetitem;

public class BudgetItemValidator : AbstractValidator<BudgetItem>
{
    public BudgetItemValidator()
    {
        RuleFor(e => e.ItemTitle)
            .NotNull()
            .MaximumLength(BudgetConstants.MaxBudgetItemTitleLength);

        RuleFor(e => e.ItemDescription)
            .NotNull()
            .MaximumLength(BudgetConstants.MaxBudgetItemDescriptionLength);

        RuleFor(e => e.BudgetOperationType).IsInEnum().NotEqual(BudgetOperationType.Unknown);
    }
}
