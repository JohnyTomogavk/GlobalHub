namespace BudgetsService.DataAccess.Context;

public class ApplicationDbContext : DbContext
{
    private readonly IDateTimeService _dateTimeService;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDateTimeService dateTimeService) :
        base(options)
    {
        _dateTimeService = dateTimeService;
    }

    public DbSet<Budget> Budgets { get; set; }

    public DbSet<BudgetItem?> BudgetsItems { get; set; }

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

        return await base.SaveChangesAsync(cancellationToken);
    }
}
