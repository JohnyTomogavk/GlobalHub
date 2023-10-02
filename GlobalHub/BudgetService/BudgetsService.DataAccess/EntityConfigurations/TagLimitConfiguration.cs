namespace BudgetsService.DataAccess.EntityConfigurations;

public class TagLimitConfiguration : IEntityTypeConfiguration<TagLimit>
{
    public void Configure(EntityTypeBuilder<TagLimit> builder)
    {
        builder.HasOne(tag => tag.Tag)
            .WithOne(t => t.TagLimit)
            .HasForeignKey<TagLimit>(tag => tag.Id);
    }
}
