using BudgetDataLayer.Constants;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.EntityConfigurations.Base;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BudgetDataLayer.EntityConfigurations;

public class BudgetItemConfiguration : BaseEntityTypeConfiguration<BudgetItem>
{
    public void Configure(EntityTypeBuilder<BudgetItem> builder)
    {
        base.Configure(builder);
        builder.Property(budgetItem => budgetItem.ItemTitle).IsRequired()
            .HasMaxLength(BudgetConstants.MaxBudgetItemTitleLength);
        builder.Property(budgetItem => budgetItem.ItemDescription).IsRequired()
            .HasMaxLength(BudgetConstants.MaxBudgetItemDescriptionLength);
        builder.HasMany(budgetItem => budgetItem.Tags).WithMany(tags => tags.BudgetItems);
    }
}
