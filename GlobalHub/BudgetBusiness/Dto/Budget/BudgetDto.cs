using BudgetBusinessLayer.Dto.BudgetItem;

namespace BudgetBusinessLayer.Dto.Budget;

public record BudgetDto
{
    public long Id { get; init; }

    public string BudgetTitle { get; init; }

    public string BudgetDescription { get; init; }

    public ICollection<BudgetItemDto> BudgetItems { get; set; }
}
