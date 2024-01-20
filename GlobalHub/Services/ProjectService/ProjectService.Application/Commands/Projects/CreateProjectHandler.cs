namespace ProjectService.Application.Commands.Projects;

public record CreateProjectRequest() : IRequest<Project>;

/// <summary>
/// Handles project creating
/// </summary>
public class CreateProjectHandler : IRequestHandler<CreateProjectRequest, Project>
{
    private readonly ApplicationDbContext _applicationDbContext;

    public CreateProjectHandler(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public async Task<Project> Handle(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var project = new Project();
        var entityEntry = await _applicationDbContext.AddAsync(project, cancellationToken);

        return entityEntry.Entity;
    }
}
