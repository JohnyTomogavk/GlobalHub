namespace ProjectService.Domain.Entities.Tags;

/// <summary>
/// Represents colored label that is used to clarify scope of task/event
/// </summary>
public class Tag : BaseEntity
{
    /// <summary>
    /// Tag title
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// Color of tag
    /// </summary>
    public ETagColor Color { get; set; }

    public long ProjectId { get; set; }

    public virtual Project? Project { get; set; }
}
