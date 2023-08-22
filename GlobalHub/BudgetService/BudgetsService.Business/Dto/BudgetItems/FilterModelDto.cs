using BudgetsService.DataAccess.Enums.Budget;

namespace BudgetsService.Business.Dto.BudgetItems;

public record FilterModelDto
{
    public string? Title { get; init; }

    public BudgetItemOperationType? BudgetItemOperationType { get; init; }

    public IEnumerable<long>? TagIds { get; init; }

    public DateTime? StartDateRange { get; init; }

    public DateTime? EndDateRange { get; init; }
};
