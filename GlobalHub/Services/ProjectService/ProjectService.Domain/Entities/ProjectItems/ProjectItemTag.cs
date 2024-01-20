namespace ProjectService.Domain.Entities.ProjectItems;

/// <summary>
/// Represents joiner between ProjectItems and Tags
/// </summary>
public class ProjectItemTag : BaseEntity
{
    public long ProjectItemId { get; set; }

    public virtual ProjectItem? ProjectItem { get; set; }

    public long TagId { get; set; }

    public Tag? Tag { get; set; }
}
