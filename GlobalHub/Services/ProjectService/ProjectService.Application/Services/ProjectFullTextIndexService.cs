namespace ProjectService.Application.Services;

public class ProjectFullTextIndexService : IFullTextIndexService<Project>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMapper _mapper;

    public ProjectFullTextIndexService(ApplicationDbContext dbContext, IPublishEndpoint publishEndpoint, IMapper mapper)
    {
        this._dbContext = dbContext;
        this._publishEndpoint = publishEndpoint;
        this._mapper = mapper;
    }

    public async Task IndexCreatedEntity(long entityId)
    {
        var project = await this.GetProject(entityId);
        var searchItemToIndex = this._mapper.Map<ProjectSearchItem>(project);
        await this._publishEndpoint.Publish(searchItemToIndex);
    }

    public async Task UpdateIndexedEntity(long entityId)
    {
        var project = await this.GetProject(entityId);
        var searchItemToIndex = this._mapper.Map<UpdateProjectSearchItem>(project);
        await this._publishEndpoint.Publish(searchItemToIndex);
    }

    public async Task RemoveEntityFromIndex(long entityId)
    {
        throw new NotImplementedException();
    }

    private async Task<Project?> GetProject(long entityId)
    {
        return await this._dbContext.Projects.SingleOrDefaultAsync(item => item.Id == entityId);
    }
}
