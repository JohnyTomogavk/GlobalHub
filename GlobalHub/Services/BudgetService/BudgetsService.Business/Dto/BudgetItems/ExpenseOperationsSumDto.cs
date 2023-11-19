namespace BudgetsService.Business.Dto.BudgetItems;

public record ExpenseOperationsSumDto
{
    public long TagId { get; init; }

    public decimal OperationsSum { get; init; }
}
