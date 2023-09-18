namespace BudgetsService.Web.Controllers;

/// <summary>
/// Controller that manages tags
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class TagController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagDto>>> GetBudgetTagsByBudgetId(long budgetId)
    {
        var tags = await _tagService.GetBudgetTags(budgetId);

        return Ok(tags);
    }

    [HttpPost]
    public async Task<ActionResult<TagDto>> CreateNewTag(TagCreateDto newTagDto)
    {
        var createdTag = await _tagService.CreateNewTag(newTagDto);

        return StatusCode(StatusCodes.Status201Created, createdTag);
    }

    [HttpPut]
    public async Task<ActionResult<TagDto>> UpdateTag(TagDto tagDto)
    {
        var updatedTag = await _tagService.UpdateTag(tagDto);

        return Ok(updatedTag);
    }

    [HttpDelete]
    public async Task<ActionResult<long>> DeleteTag(long tagId)
    {
        var deletedTagId = await _tagService.DeleteTag(tagId);

        return Ok(deletedTagId);
    }
}
