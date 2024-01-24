namespace ProjectService.Presentation.Controllers;

/// <summary>
/// Controller that manages project items
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class ProjectItemsController : BaseController<ProjectItem, ProjectItemDto>
{
    public ProjectItemsController(IMediator mediator) : base(mediator)
    {
    }
}
