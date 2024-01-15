namespace ProjectService.Domain.Configurations;

public class ProjectItemTagTypeConfiguration : BaseEntityTypeConfiguration<ProjectItemTag>
{
    protected override void ConfigureEntity(EntityTypeBuilder<ProjectItemTag> builder)
    {
        builder.HasOne(pit => pit.ProjectItem)
            .WithMany(pi => pi.ProjectItemTags)
            .HasForeignKey(pi => pi.ProjectItemId);

        builder.HasOne(pit => pit.Tag)
            .WithMany()
            .HasForeignKey(pit => pit.TagId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
