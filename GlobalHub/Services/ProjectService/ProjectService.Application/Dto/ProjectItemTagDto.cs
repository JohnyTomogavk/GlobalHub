namespace ProjectService.Application.Dto;

public record ProjectItemTagDto
{
    public long Id { get; init; }

    public long ProjectItemId { get; init; }

    public ProjectItemDto? ProjectItem { get; init; }

    public long TagId { get; init; }

    public TagDto? Tag { get; init; }
}
