using BudgetDataLayer.Entities.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BudgetDataLayer.EntityConfigurations.Base;

public class BaseEntityTypeConfiguration<T> : IEntityTypeConfiguration<T>
    where T: BaseEntity
{
    public void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasKey(e => e.Id);
    }
}
