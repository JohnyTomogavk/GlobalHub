namespace ProjectService.Presentation.Controllers;

/// <summary>
/// Controller that manages project items
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class ProjectItemsController : BaseController<ProjectItem, ProjectItemDto>
{
    private readonly IMediator _mediator;

    public ProjectItemsController(IMediator mediator)
        : base(mediator)
    {
        this._mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<ProjectItemDto>> CreateProjectTask([FromBody] CreateTaskRequest createTaskRequest)
    {
        var createdTask = await this._mediator.Send(createTaskRequest);

        return this.StatusCode(StatusCodes.Status201Created, createdTask);
    }
}
