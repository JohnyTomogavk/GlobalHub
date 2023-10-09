namespace BudgetsService.Business.Dto.BudgetItems;

public record ExpenseOperationSumByDayDto
{
    public DateTime OperationDate { get; init; }

    public decimal OperationCostsSum { get; init; }
}
