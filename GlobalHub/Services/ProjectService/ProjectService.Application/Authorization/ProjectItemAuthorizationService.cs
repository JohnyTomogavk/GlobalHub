namespace ProjectService.Application.Authorization;

public class ProjectItemAuthorizationService : IAuthorizationService<ProjectItem>
{
    private readonly ApplicationDbContext _dbContext;

    public ProjectItemAuthorizationService(ApplicationDbContext dbContext)
    {
        this._dbContext = dbContext;
    }

    public Expression<Func<ProjectItem, bool>> GetSearchFilterExpressions(string userId)
    {
        return projectItem => projectItem.Project.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeRead(string userId, long entityId)
    {
        var projectItem = await this._dbContext.ProjectItems
            .Include(tag => tag.Project)
            .SingleOrDefaultAsync(e => e.Id == entityId);

        return projectItem?.Project?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeUpdate(string userId, long entityId)
    {
        var projectItem = await this._dbContext.ProjectItems
            .Include(tag => tag.Project)
            .SingleOrDefaultAsync(e => e.Id == entityId);

        return projectItem?.Project?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeDelete(string userId, long entityId)
    {
        var projectItem = await this._dbContext.ProjectItems
            .Include(tag => tag.Project)
            .SingleOrDefaultAsync(e => e.Id == entityId);

        return projectItem?.Project?.CreatedBy == userId;
    }
}
