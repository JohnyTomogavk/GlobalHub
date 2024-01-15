namespace ProjectService.Domain.Entities.Projects;

/// <summary>
/// Project represents named logical storage for tasks and events
/// </summary>
public class Project : BaseEntity, IHasDate, IHasCreator
{
    /// <summary>
    /// Title of a project
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// Created tags
    /// </summary>
    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    /// <summary>
    /// Created in a project project items
    /// </summary>
    public virtual ICollection<ProjectItem> ProjectItems { get; set; } = new List<ProjectItem>();

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }
}
