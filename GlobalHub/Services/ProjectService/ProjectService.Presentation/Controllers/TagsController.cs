namespace ProjectService.Presentation.Controllers;

/// <summary>
/// Controller that manages tags
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class TagsController : BaseController<Tag, TagDto>
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="TagsController"/> class.
    /// </summary>
    /// <param name="mediator">MediatR instance.</param>
    public TagsController(IMediator mediator)
        : base(mediator)
    {
        this._mediator = mediator;
    }

    /// <summary>
    /// Creates new tag on project
    /// </summary>
    /// <param name="createTagRequest">Bew tag data.</param>
    /// <returns>Dto of created tag.</returns>
    [HttpPost]
    public async Task<ActionResult<TagDto>> Create(CreateTagRequest createTagRequest)
    {
        var createdTag = await this._mediator.Send(createTagRequest);

        return this.StatusCode(StatusCodes.Status201Created, createdTag);
    }
}
