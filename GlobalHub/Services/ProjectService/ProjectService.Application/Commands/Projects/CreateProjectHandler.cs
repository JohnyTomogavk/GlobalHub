using Common.EventBus.Messages.FullTextSearchModels.Projects;

namespace ProjectService.Application.Commands.Projects;

public record CreateProjectRequest : IRequest<ProjectDto>;

/// <summary>
/// Handles project creating
/// </summary>
public class CreateProjectHandler : IRequestHandler<CreateProjectRequest, ProjectDto>
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public CreateProjectHandler(
        ApplicationDbContext applicationDbContext,
        IMapper mapper,
        IPublishEndpoint publishEndpoint)
    {
        this._applicationDbContext = applicationDbContext;
        this._mapper = mapper;
        this._publishEndpoint = publishEndpoint;
    }

    public async Task<ProjectDto> Handle(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var project = new Project();
        var entityEntry = await this._applicationDbContext.AddAsync(project, cancellationToken);
        await this._applicationDbContext.SaveChangesAsync(cancellationToken);
        var updatedProjectDto = this._mapper.Map<ProjectDto>(entityEntry.Entity);
        await this.IndexCreatedProject(entityEntry.Entity, cancellationToken);

        return updatedProjectDto;
    }

    private async Task IndexCreatedProject(Project createdProject, CancellationToken cancellationToken)
    {
        var searchItemToIndex = this._mapper.Map<ProjectSearchItem>(createdProject);
        await this._publishEndpoint.Publish(searchItemToIndex, cancellationToken);
    }
}
