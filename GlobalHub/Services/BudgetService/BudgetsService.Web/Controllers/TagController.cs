namespace BudgetsService.Web.Controllers;

/// <summary>
/// Controller that manages tags
/// </summary>
[Authorize]
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class TagController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagController(ITagService tagService)
    {
        _tagService = tagService;
    }

    /// <summary>
    /// Returns tags related to budgets
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Tag dtos</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagDto>>> GetBudgetTagsByBudgetId(long budgetId)
    {
        var tags = await _tagService.GetBudgetTags(budgetId);

        return StatusCode(StatusCodes.Status200OK, tags);
    }

    /// <summary>
    /// Creates new tag
    /// </summary>
    /// <param name="newTagDto">Tag data</param>
    /// <returns>Created tag dto</returns>
    [HttpPost]
    public async Task<ActionResult<TagDto>> CreateNewTag(TagCreateDto newTagDto)
    {
        var createdTag = await _tagService.CreateNewTag(newTagDto);

        return StatusCode(StatusCodes.Status201Created, createdTag);
    }

    /// <summary>
    /// Updates tag
    /// </summary>
    /// <param name="tagDto">Tag data</param>
    /// <returns>Updated tag data</returns>
    [HttpPut]
    public async Task<ActionResult<TagDto>> UpdateTag(TagDto tagDto)
    {
        var updatedTag = await _tagService.UpdateTag(tagDto);

        return StatusCode(StatusCodes.Status200OK, updatedTag);
    }

    /// <summary>
    /// Deletes tag
    /// </summary>
    /// <param name="tagId">Tag id</param>
    /// <returns>Deleted tag's id</returns>
    [HttpDelete]
    public async Task<ActionResult<long>> DeleteTag(long tagId)
    {
        var deletedTagId = await _tagService.DeleteTag(tagId);

        return Ok(deletedTagId);
    }
}
