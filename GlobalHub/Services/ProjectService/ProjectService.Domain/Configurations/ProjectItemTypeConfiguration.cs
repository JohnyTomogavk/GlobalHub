namespace ProjectService.Domain.Configurations;

public class ProjectItemTypeConfiguration : BaseEntityTypeConfiguration<ProjectItem>
{
    protected override void ConfigureEntity(EntityTypeBuilder<ProjectItem> builder)
    {
        builder.HasOne(pi => pi.Project)
            .WithMany(p => p.ProjectItems)
            .HasForeignKey(pi => pi.ProjectId);

        builder.HasOne(pi => pi.ParentProjectItem)
            .WithMany()
            .HasForeignKey(pi => pi.ParentProjectItemId);
    }
}
