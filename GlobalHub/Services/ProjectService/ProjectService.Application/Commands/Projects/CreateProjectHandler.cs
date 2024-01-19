namespace ProjectService.Application.Commands.Projects;

/// <summary>
/// Handles project creating
/// </summary>
public class CreateProjectHandler : IRequestHandler<CreateProjectRequest, Project>
{
    private readonly IProjectService _projectService;

    public CreateProjectHandler(IProjectService projectService)
    {
        _projectService = projectService;
    }

    public async Task<Project> Handle(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var project = new Project();
        var createdProjectId = await _projectService.Create(project);

        return createdProjectId;
    }
}
