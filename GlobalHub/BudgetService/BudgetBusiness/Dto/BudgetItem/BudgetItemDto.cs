using BudgetDataLayer.Entities.Budget;

namespace BudgetBusinessLayer.Dto.BudgetItem;

public record BudgetItemDto
{
    public long Id { get; init; }

    public string ItemTitle { get; init; } = string.Empty;

    public string ItemDescription { get; init; } = string.Empty;

    public BudgetOperationType BudgetOperationType { get; init; }

    public decimal BudgetOperationCost { get; init; }

    public DateTime CreatedDate { get; init; }

    public DateTime? UpdatedDate { get; init; }
}
