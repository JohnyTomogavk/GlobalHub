namespace ProjectService.Application.Dto;

public record TagDto
{
    public long Id { get; init; }

    public string Label { get; init; }

    public ETagColor Color { get; init; }

    public long ProjectId { get; init; }
}
