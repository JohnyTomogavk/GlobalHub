namespace ProjectService.Presentation.Controllers;

[ApiController]
[Route("api/v1/[controller]/[action]")]
public class ProjectsController : BaseController<Project, ProjectDto>
{
    private readonly IMediator _mediator;

    public ProjectsController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Project>> Create()
    {
        var createdProject = await _mediator.Send(new CreateProjectRequest());

        return StatusCode(StatusCodes.Status201Created, createdProject);
    }

    [HttpDelete]
    public async Task<ActionResult<Project>> Delete(long projectId)
    {
        var deleteProjectRequest = new DeleteProjectRequest(projectId);
        var createdProject = await _mediator.Send(deleteProjectRequest);

        return StatusCode(StatusCodes.Status200OK, createdProject);
    }
}
