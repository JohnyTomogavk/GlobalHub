namespace BudgetsService.DataAccess.EntityConfigurations.Base;

/// <summary>
/// Base type for using in entities configuration
/// </summary>
/// <typeparam name="T">Entity type that entity configuration is for</typeparam>
public class BaseEntityTypeConfiguration<T> : IEntityTypeConfiguration<T>
    where T : BaseEntity
{
    public void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasKey(e => e.Id);
    }
}
