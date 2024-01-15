namespace ProjectService.Domain.Configurations;

public class ProjectTypeConfiguration : BaseEntityTypeConfiguration<Project>
{
    protected override void ConfigureEntity(EntityTypeBuilder<Project> builder)
    {
        builder.HasMany(p => p.ProjectItems)
            .WithOne(pi => pi.Project)
            .HasForeignKey(pi => pi.ProjectId);

        builder.HasMany(p => p.Tags)
            .WithOne(tag => tag.Project)
            .HasForeignKey(tag => tag.ProjectId);
    }
}
