namespace ProjectService.Application.Dto;

public record TagDto
{
    public long Id { get; init; }

    public string Title { get; init; }

    public ETagColor Color { get; init; }

    public long ProjectId { get; init; }

    public ProjectDto? Project { get; init; }
}
