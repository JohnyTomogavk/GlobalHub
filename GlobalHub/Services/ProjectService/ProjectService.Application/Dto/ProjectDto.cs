namespace ProjectService.Application.Dto;

public record ProjectDto
{
    public long Id { get; init; }

    public string Title { get; init; }

    public ICollection<TagDto> Tags { get; init; }

    public ICollection<ProjectItemDto> ProjectItems { get; init; }

    public DateTimeOffset CreatedDate { get; init; }

    public DateTimeOffset? UpdatedDate { get; init; }

    public string CreatedBy { get; init; }

    public string? UpdatedBy { get; init; }
}
