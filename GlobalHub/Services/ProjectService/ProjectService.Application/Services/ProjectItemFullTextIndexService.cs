namespace ProjectService.Application.Services;

public class ProjectItemFullTextIndexService : IFullTextIndexService<ProjectItem>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMapper _mapper;

    public ProjectItemFullTextIndexService(
        ApplicationDbContext dbContext,
        IPublishEndpoint publishEndpoint,
        IMapper mapper)
    {
        this._dbContext = dbContext;
        this._publishEndpoint = publishEndpoint;
        this._mapper = mapper;
    }

    public async Task IndexCreatedEntity(long entityId)
    {
        var projectItemToIndex = await this.GetProject(entityId);
        var searchItemToIndex = this._mapper.Map<ProjectItemSearchItem>(projectItemToIndex);
        await this._publishEndpoint.Publish(searchItemToIndex);
    }

    public async Task UpdateIndexedEntity(long entityId)
    {
        var projectItemToIndex = await this.GetProject(entityId);
        var searchItemToIndex = this._mapper.Map<UpdateProjectItemSearchItem>(projectItemToIndex);
        await this._publishEndpoint.Publish(searchItemToIndex);
    }

    public async Task RemoveEntityFromIndex(long entityId)
    {
        throw new NotImplementedException();
    }

    private async Task<ProjectItem?> GetProject(long entityId)
    {
        return await this._dbContext.ProjectItems
            .Include(t => t.ProjectItemTags)
            .ThenInclude(t => t.Tag)
            .SingleOrDefaultAsync(item => item.Id == entityId);
    }
}
