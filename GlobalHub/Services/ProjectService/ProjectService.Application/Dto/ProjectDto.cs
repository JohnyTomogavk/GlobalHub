namespace ProjectService.Application.Dto;

public record ProjectDto
{
    public long Id { get; init; }

    public string Title { get; init; }

    public ICollection<TagDto> Tags { get; init; }

    public ICollection<ProjectItemDto> ProjectItems { get; init; }

    public DateTime CreatedDate { get; init; }

    public DateTime? UpdatedDate { get; init; }

    public string CreatedBy { get; init; }

    public string? UpdatedBy { get; init; }
}
