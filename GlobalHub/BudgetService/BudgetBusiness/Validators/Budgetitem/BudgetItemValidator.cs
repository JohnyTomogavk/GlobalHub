using BudgetDataLayer.Constants;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.Enums.Budget;
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

        RuleFor(e => e.BudgetItemOperationType).IsInEnum().NotEqual(BudgetItemOperationType.Unknown);
        RuleFor(e => e.BudgetItemRegularityType).IsInEnum().NotEqual(BudgetItemRegularityType.Unknown);
    }
}
