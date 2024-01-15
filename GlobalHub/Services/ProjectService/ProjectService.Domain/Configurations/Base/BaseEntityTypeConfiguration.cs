namespace ProjectService.Domain.Configurations.Base;

public abstract class BaseEntityTypeConfiguration<T> : IEntityTypeConfiguration<T>
    where T : BaseEntity
{
    public void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasKey(entity => entity.Id);
        ConfigureEntity(builder);
    }

    protected abstract void ConfigureEntity(EntityTypeBuilder<T> builder);
}
