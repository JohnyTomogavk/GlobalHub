using BudgetsService.DataAccess.Entities.Budgets;

namespace BudgetsService.Business.Dto.BudgetItems;

public record BudgetItemPaginatedResponse
{
    public IEnumerable<BudgetItemDto> BudgetItems { get; init; }

    public int TotalItems { get; init; }

    public decimal TotalIncoming { get; init; }

    public decimal TotalExpenses { get; init; }
}
