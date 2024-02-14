namespace ProjectService.Application.Dto;

public record ProjectItemDto
{
    public long Id { get; init; }

    public string? Title { get; init; }

    public string? Description { get; init; }

    public EProjectItemType ItemType { get; init; }

    public EPriority ItemPriority { get; init; }

    public ETaskStatus TaskStatus { get; init; }

    public DateTime? StartDate { get; init; }

    public DateTime? DueDate { get; init; }

    public ICollection<ProjectItemTagDto> ProjectItemTags { get; init; }

    public long? ParentProjectItemId { get; init; }

    public ProjectItemDto? ParentProjectItem { get; init; }

    public long ProjectId { get; init; }

    public DateTime CreatedDate { get; init; }

    public DateTime? UpdatedDate { get; init; }

    public string? CreatedBy { get; init; }

    public string? UpdatedBy { get; init; }
}
