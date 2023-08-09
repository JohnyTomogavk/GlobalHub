using BudgetDataLayer.Constants;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.EntityConfigurations.Base;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BudgetDataLayer.EntityConfigurations;

public class BudgetConfiguration : BaseEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        base.Configure(builder);
        builder.Property(budget => budget.Id).ValueGeneratedOnAdd();
        builder.Property(budget => budget.BudgetTitle).IsRequired().HasMaxLength(BudgetConstants.MaxBudgetTitleLength);
        builder.Property(budget => budget.BudgetDescription).IsRequired()
            .HasMaxLength(BudgetConstants.MaxBudgetDescriptionLength);
        builder.HasMany(t => t.BudgetItems).WithOne(t => t.Budget);
    }
}
