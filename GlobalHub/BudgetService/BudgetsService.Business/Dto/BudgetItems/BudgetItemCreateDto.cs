namespace BudgetsService.Business.Dto.BudgetItems;

public record BudgetItemCreateDto
{
    public string ItemTitle { get; init; }

    public string? ItemDescription { get; init; }

    public BudgetItemOperationType BudgetItemOperationType { get; init; }

    public BudgetItemRegularityType BudgetItemRegularityType { get; init; }

    public decimal BudgetOperationCost { get; init; }

    public DateTime PaymentDate { get; init; }

    public IEnumerable<long> TagIds { get; init; } = new List<long>();

    public long BudgetId { get; set; }
}
