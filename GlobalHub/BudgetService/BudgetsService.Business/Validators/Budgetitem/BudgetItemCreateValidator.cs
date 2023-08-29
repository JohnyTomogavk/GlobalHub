namespace BudgetsService.Business.Validators.Budgetitem;

public class BudgetItemCreateValidator : AbstractValidator<BudgetItemCreateDto>
{
    public BudgetItemCreateValidator()
    {
        RuleFor(item => item.ItemTitle).NotEmpty();
        RuleFor(item => item.BudgetOperationCost).GreaterThanOrEqualTo(0);
        RuleFor(item => item.BudgetItemRegularityType).NotEqual(BudgetItemRegularityType.Unknown);
        RuleFor(item => item.BudgetItemOperationType).NotEqual(BudgetItemOperationType.Unknown);
    }
}
