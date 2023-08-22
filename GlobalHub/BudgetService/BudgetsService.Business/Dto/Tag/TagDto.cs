namespace BudgetsService.Business.Dto.Tag;

public record TagDto
{
    public long Id { get; init; }

    public string Label { get; init; }

    public string Color { get; init; }
}
