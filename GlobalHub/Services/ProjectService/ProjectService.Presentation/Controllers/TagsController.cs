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

    /// <summary>
    /// Updates tag
    /// </summary>
    /// <param name="request">Tag data to update.</param>
    /// <returns>Updated tag dto.</returns>
    [HttpPut]
    public async Task<ActionResult<TagDto>> Update(UpdateTagRequest request)
    {
        var tagDto = await this._mediator.Send(request);

        return this.StatusCode(StatusCodes.Status200OK, tagDto);
    }

    /// <summary>
    /// Deletes project's tag
    /// </summary>
    /// <param name="request">Tag data to delete.</param>
    /// <returns>Id of deleted tag.</returns>
    [HttpDelete]
    public async Task<ActionResult<long>> Delete([FromQuery]DeleteTagRequest request)
    {
        var deletedTagId = await this._mediator.Send(request);

        return this.StatusCode(StatusCodes.Status200OK, deletedTagId);
    }
}
