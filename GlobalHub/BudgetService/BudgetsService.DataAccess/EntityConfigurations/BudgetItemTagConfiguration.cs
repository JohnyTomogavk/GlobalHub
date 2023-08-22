using BudgetsService.DataAccess.EntityConfigurations.Base;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BudgetsService.DataAccess.EntityConfigurations;

public class BudgetItemTagConfiguration : BaseEntityTypeConfiguration<BudgetItemTag>
{
    public void Configure(EntityTypeBuilder<BudgetItemTag> builder)
    {
        base.Configure(builder);
        builder.HasOne(item => item.BudgetItem)
            .WithMany(budgetItem => budgetItem.BudgetItemTags)
            .HasForeignKey(budgetItemTag => budgetItemTag.BudgetItemId);
        builder.HasOne(item => item.Tag)
            .WithMany()
            .HasForeignKey(budgetItemTag => budgetItemTag.TagId);
    }
}
