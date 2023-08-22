using BudgetsService.DataAccess.Constants;
using BudgetsService.DataAccess.Entities.Budgets;
using BudgetsService.DataAccess.EntityConfigurations.Base;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BudgetsService.DataAccess.EntityConfigurations;

public class BudgetConfiguration : BaseEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        base.Configure(builder);
        builder.Property(budget => budget.Id).ValueGeneratedOnAdd();
        builder.Property(budget => budget.BudgetTitle).IsRequired().HasMaxLength(BudgetConstants.MaxBudgetTitleLength);
        builder.Property(budget => budget.BudgetDescription).IsRequired()
            .HasMaxLength(BudgetConstants.MaxBudgetDescriptionLength);
        builder.HasMany(t => t.BudgetItems).WithOne(t => t.Budget)
            .HasForeignKey(t => t.BudgetId);
        builder.HasMany(t => t.BudgetTags).WithOne(t => t.Budget)
            .HasForeignKey(t => t.BudgetId);
    }
}
