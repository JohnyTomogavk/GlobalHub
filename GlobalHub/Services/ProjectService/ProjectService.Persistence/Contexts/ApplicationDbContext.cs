namespace ProjectService.Persistence.Contexts;

public class ApplicationDbContext : DbContext
{
    private readonly IUserService _userService;
    private readonly IDateTimeService _dateTimeService;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> dbContextOptions,
        IUserService userService, IDateTimeService dateTimeService) :
        base(dbContextOptions)
    {
        _userService = userService;
        _dateTimeService = dateTimeService;
    }

    public DbSet<Project> Projects { get; set; }

    public DbSet<ProjectItem> ProjectItems { get; set; }

    public DbSet<ProjectItemTag> ProjectItemTags { get; set; }

    public DbSet<Tag> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetAssembly(typeof(Tag)));
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
