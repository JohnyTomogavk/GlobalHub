namespace BudgetsService.DataAccess.EntityConfigurations;

public class TagConfiguration : BaseEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        base.Configure(builder);
        builder.HasOne(tag => tag.Budget)
            .WithMany(budget => budget.BudgetTags)
            .HasForeignKey(tag => tag.BudgetId);
    }
}
