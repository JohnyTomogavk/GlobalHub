namespace ProjectService.Application.Requests;

public record BaseProjectItemCreateRequest : IRequest<ProjectItemDto>, IValidatable
{
    public long ProjectId { get; init; }

    public string Title { get; init; }

    public string? Description { get; init; }

    public EProjectItemType ItemType { get; init; }

    public EPriority ItemPriority { get; init; }

    public DateTime? StartDate { get; init; }

    public DateTime? DueDate { get; init; }

    public ICollection<long> TagIds { get; init; }
}
