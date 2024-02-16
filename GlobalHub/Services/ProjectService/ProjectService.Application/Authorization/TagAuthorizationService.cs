namespace ProjectService.Application.Authorization;

public class TagAuthorizationService : IAuthorizationService<Tag>
{
    private readonly ApplicationDbContext _dbContext;

    public TagAuthorizationService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Expression<Func<Tag, bool>> GetSearchFilterExpressions(string userId)
    {
        return tag => tag.Project.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeRead(string userId, long entityId)
    {
        var tag = await this._dbContext.Tags
            .Include(tag => tag.Project)
            .SingleOrDefaultAsync(e => e.Id == entityId);

        return tag?.Project?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeUpdate(string userId, long entityId)
    {
        var tag = await this._dbContext.Tags
            .Include(tag => tag.Project)
            .SingleOrDefaultAsync(e => e.Id == entityId);

        return tag?.Project?.CreatedBy == userId;
    }

    public async Task<bool> AuthorizeDelete(string userId, long entityId)
    {
        var tag = await this._dbContext.Tags
            .Include(tag => tag.Project)
            .SingleOrDefaultAsync(e => e.Id == entityId);

        return tag?.Project?.CreatedBy == userId;
    }
}
