namespace ProjectService.Presentation.Controllers;

/// <summary>
/// Controller that manages projects
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class ProjectsController : BaseController<Project, ProjectDto>
{
    private readonly IMediator _mediator;

    public ProjectsController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Creates project
    /// </summary>
    /// <returns>Returns created project's dto</returns>
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Create()
    {
        var createdProject = await _mediator.Send(new CreateProjectRequest());

        return StatusCode(StatusCodes.Status201Created, createdProject);
    }

    /// <summary>
    /// Updates project's title
    /// </summary>
    /// <param name="request">Project's data</param>
    /// <returns>Updated project's dto</returns>
    [HttpPut]
    public async Task<ActionResult<ProjectDto>> UpdateTitle(UpdateProjectNameRequest request)
    {
        var createdProject = await _mediator.Send(request);

        return StatusCode(StatusCodes.Status200OK, createdProject);
    }

    /// <summary>
    /// Deletes project
    /// </summary>
    /// <param name="projectId">Project's id</param>
    /// <returns>Id of deleted project</returns>
    [HttpDelete]
    public async Task<ActionResult<long>> Delete(long projectId)
    {
        var deleteProjectRequest = new DeleteProjectRequest(projectId);
        var deletedProjectId = await _mediator.Send(deleteProjectRequest);

        return StatusCode(StatusCodes.Status200OK, deletedProjectId);
    }
}
