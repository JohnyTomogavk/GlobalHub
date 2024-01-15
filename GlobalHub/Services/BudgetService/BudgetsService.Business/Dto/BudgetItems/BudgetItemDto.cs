using Common.Interface;

namespace BudgetsService.Business.Dto.BudgetItems;

public record BudgetItemDto : IHasDate
{
    public long Id { get; init; }

    public string ItemTitle { get; init; } = string.Empty;

    public string ItemDescription { get; init; } = string.Empty;

    public BudgetItemOperationType BudgetItemOperationType { get; init; }

    public BudgetItemRegularityType BudgetItemRegularityType { get; init; }

    public decimal OperationCost { get; init; }

    public DateTime OperationDate { get; init; }

    public IEnumerable<long> TagIds { get; init; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
