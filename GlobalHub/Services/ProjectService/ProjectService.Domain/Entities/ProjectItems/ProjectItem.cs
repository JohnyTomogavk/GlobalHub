namespace ProjectService.Domain.Entities.ProjectItems;

/// <summary>
/// Entity represents user-created task or event
/// </summary>
public class ProjectItem : BaseEntity, IHasDate, IHasCreator, ICloneable
{
    /// <summary>
    /// Item title
    /// </summary>
    public string? Title { get; set; }

    /// <summary>
    /// Item description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Represents type of item in a project
    /// </summary>
    public EProjectItemType ItemType { get; set; }

    public EPriority ItemPriority { get; set; }

    public ETaskStatus TaskStatus { get; set; }

    /// <summary>
    /// Represents date when task/event is going to be started
    /// </summary>
    public DateTime? StartDate { get; set; }

    /// <summary>
    /// Represents date when task/event is going to be finished
    /// </summary>
    public DateTime? DueDate { get; set; }

    public virtual ICollection<ProjectItemTag> ProjectItemTags { get; set; } = new List<ProjectItemTag>();

    public long? ParentProjectItemId { get; set; }

    public virtual ProjectItem? ParentProjectItem { get; set; }

    public long ProjectId { get; set; }

    public virtual Project? Project { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }

    public object Clone()
    {
        return this.MemberwiseClone();
    }
}
