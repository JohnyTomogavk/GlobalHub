namespace ProjectService.Application.Dto;

public record ProjectItemDto
{
    public long Id { get; init; }

    public string? Title { get; init; }

    public string? Description { get; init; }

    public EProjectItemType ItemType { get; init; }

    public EPriority ItemPriority { get; init; }

    public ETaskStatus TaskStatus { get; init; }

    public DateTimeOffset? StartDate { get; init; }

    public DateTimeOffset? DueDate { get; init; }

    public ICollection<ProjectItemTagDto> ProjectItemTags { get; init; }

    public long? ParentProjectItemId { get; init; }

    public ProjectItemDto? ParentProjectItem { get; init; }

    public long ProjectId { get; init; }

    public DateTimeOffset CreatedDate { get; init; }

    public DateTimeOffset? UpdatedDate { get; init; }

    public string? CreatedBy { get; init; }

    public string? UpdatedBy { get; init; }
}
