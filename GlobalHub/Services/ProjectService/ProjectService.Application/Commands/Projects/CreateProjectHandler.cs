namespace ProjectService.Application.Commands.Projects;

public record CreateProjectRequest : IRequest<ProjectDto>;

/// <summary>
/// Handles project creating
/// </summary>
public class CreateProjectHandler : IRequestHandler<CreateProjectRequest, ProjectDto>
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateProjectHandler(ApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }

    public async Task<ProjectDto> Handle(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var project = new Project();
        var entityEntry = await _applicationDbContext.AddAsync(project, cancellationToken);
        await _applicationDbContext.SaveChangesAsync(cancellationToken);
        var updatedProjectDto = _mapper.Map<ProjectDto>(entityEntry.Entity);

        return updatedProjectDto;
    }
}
