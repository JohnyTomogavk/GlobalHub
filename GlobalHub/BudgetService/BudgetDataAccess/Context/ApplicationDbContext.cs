﻿using System.Reflection;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.Interface;
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

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        foreach (var entry in ChangeTracker.Entries<IHasDate>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedDate = DateTime.UtcNow;
                    break;
                default:
                    break;
            }
        }
    
        return await base.SaveChangesAsync(cancellationToken);
    }
}