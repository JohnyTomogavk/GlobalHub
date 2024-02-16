namespace ProjectService.Application.Authorization;

public class ProjectAuthorizationService : IAuthorizationService<Project>
{
    private readonly ApplicationDbContext _dbContext;

    public ProjectAuthorizationService(ApplicationDbContext dbContext)
    {
        this._dbContext = dbContext;
    }

    public Expression<Func<Project, bool>> GetSearchFilterExpressions(string userId)
    {
        return (project) => project.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeRead(string userId, long entityId)
    {
        var project = await this._dbContext.Projects.SingleOrDefaultAsync(e => e.Id == entityId);

        return project?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeUpdate(string userId, long entityId)
    {
        var project = await this._dbContext.Projects.SingleOrDefaultAsync(e => e.Id == entityId);

        return project?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeDelete(string userId, long entityId)
    {
        var project = await this._dbContext.Projects.SingleOrDefaultAsync(e => e.Id == entityId);

        return project?.CreatedBy == userId;
    }
}
