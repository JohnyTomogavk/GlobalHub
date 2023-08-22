using BudgetsService.DataAccess.Constants;
using BudgetsService.DataAccess.EntityConfigurations.Base;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BudgetsService.DataAccess.EntityConfigurations;

public class BudgetItemConfiguration : BaseEntityTypeConfiguration<BudgetItem>
{
    public void Configure(EntityTypeBuilder<BudgetItem> builder)
    {
        base.Configure(builder);
        builder.Property(budgetItem => budgetItem.ItemTitle).IsRequired()
            .HasMaxLength(BudgetConstants.MaxBudgetItemTitleLength);
        builder.Property(budgetItem => budgetItem.ItemDescription).IsRequired()
            .HasMaxLength(BudgetConstants.MaxBudgetItemDescriptionLength);
        builder.HasMany(budgetItem => budgetItem.BudgetItemTags)
            .WithOne(item => item.BudgetItem);
    }
}
