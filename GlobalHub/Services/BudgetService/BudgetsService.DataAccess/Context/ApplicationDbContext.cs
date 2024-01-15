using Common.Interface;
using Common.Services.Abstract;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BudgetsService.DataAccess.Context;

public class ApplicationDbContext : DbContext
{
    private readonly IDateTimeService _dateTimeService;
    private readonly IUserService _userService;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IDateTimeService dateTimeService,
        IUserService userService) :
        base(options)
    {
        _dateTimeService = dateTimeService;
        _userService = userService;
    }

    public DbSet<Budget> Budgets { get; set; }

    public DbSet<BudgetItem> BudgetsItems { get; set; }

    public DbSet<BudgetItemTag> BudgetItemTags { get; set; }

    public DbSet<Tag> Tags { get; set; }

    public DbSet<TagLimit> TagLimits { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        foreach (var entry in ChangeTracker.Entries<IHasDate>())
        {
            UpdateDates(entry);
        }

        foreach (var entry in ChangeTracker.Entries<IHasCreator>())
        {
            UpdateAuthors(entry);
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuthors(EntityEntry<IHasCreator> entry)
    {
        switch (entry.State)
        {
            case EntityState.Added:
                entry.Entity.CreatedBy = _userService.UserId;
                break;
            case EntityState.Modified:
                entry.Entity.UpdatedBy = _userService.UserId;
                break;
            default:
                break;
        }
    }

    private void UpdateDates(EntityEntry<IHasDate> entry)
    {
        switch (entry.State)
        {
            case EntityState.Added:
                entry.Entity.CreatedDate = _dateTimeService.CurrentDate;
                break;
            case EntityState.Modified:
                entry.Entity.UpdatedDate = _dateTimeService.CurrentDate;
                break;
            default:
                break;
        }
    }
}
