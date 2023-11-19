namespace BudgetsService.Business.Dto.Tag;

public record TagCreateDto
{
    public long BudgetId { get; init; }

    public string Label { get; init; }

    public TagColor Color { get; init; }
}
