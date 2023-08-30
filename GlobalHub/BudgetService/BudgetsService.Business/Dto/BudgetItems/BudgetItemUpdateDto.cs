namespace BudgetsService.Business.Dto.BudgetItems;

public record BudgetItemUpdateDto : BudgetItemCreateDto
{
    public long Id { get; init; }
}
