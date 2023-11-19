namespace BudgetsService.Business.Dto.BudgetItems;

public record BudgetItemsQueryOptions
{
    public int PageNumber { get; init; }

    public int ItemsPerPageCount { get; init; }

    public string? SortColumn { get; init; }

    public bool SortByAscending { get; init; } = true;

    public FilterModelDto? FilterModelDto { get; init; }
}
