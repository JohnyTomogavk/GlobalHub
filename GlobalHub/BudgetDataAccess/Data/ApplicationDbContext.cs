using System.Reflection;
using BudgetDataLayer.Entities.Budget;
using Microsoft.EntityFrameworkCore;

namespace BudgetDataLayer.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Budget> Budgets { get; set; }

    public DbSet<BudgetItem> BudgetsItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
