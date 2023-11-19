namespace BudgetsService.Business.Validators.BudgetItems;

public class BudgetItemBaseValidator<T> : AbstractValidator<T>
    where T : BudgetItemCreateDto
{
    public BudgetItemBaseValidator()
    {
        RuleFor(item => item.ItemTitle).NotEmpty();
        RuleFor(item => item.OperationCost).GreaterThanOrEqualTo(0);
        RuleFor(item => item.BudgetItemRegularityType).NotEqual(BudgetItemRegularityType.Unknown);
        RuleFor(item => item.BudgetItemOperationType).NotEqual(BudgetItemOperationType.Unknown);
    }
}
