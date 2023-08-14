using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.Enums.Budget;

namespace BudgetBusinessLayer.Dto.BudgetItem;

public record BudgetItemDto
{
    public long Id { get; init; }

    public string ItemTitle { get; init; } = string.Empty;

    public string ItemDescription { get; init; } = string.Empty;

    public BudgetItemOperationType BudgetItemOperationType { get; init; }

    public decimal BudgetOperationCost { get; init; }

    public ICollection<Tag> Tags { get; set; }

    public DateTime CreatedDate { get; init; }

    public DateTime? UpdatedDate { get; init; }
}
