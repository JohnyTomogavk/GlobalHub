namespace ProjectService.Presentation.Controllers;

/// <summary>
/// Controller that manages tags
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class TagsController : BaseController<Tag, TagDto>
{
    public TagsController(IMediator mediator) : base(mediator)
    {
    }
}
