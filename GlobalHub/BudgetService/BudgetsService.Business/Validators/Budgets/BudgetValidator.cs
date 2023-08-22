﻿namespace BudgetsService.Business.Validators.Budgets;

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