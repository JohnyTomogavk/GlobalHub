namespace ProjectService.Presentation.Controllers;

[ApiController]
[Route("api/v1/[controller]/[action]")]
public class ProjectsController : BaseController<Project>
{
    private readonly IMediator _mediator;

    public ProjectsController(IBaseService<Project> baseService, IMediator mediator) : base(baseService)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Project>> Create()
    {
        var createdProject = await _mediator.Send(new CreateProjectRequest());

        return StatusCode(StatusCodes.Status201Created, createdProject);
    }
}
