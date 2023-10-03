namespace BudgetsService.Web.Controllers;

[ApiController]
[Route("api/v1/[controller]/[action]")]
public class TagLimitsController : ControllerBase
{
    private readonly ITagLimitService _tagLimitService;

    public TagLimitsController(ITagLimitService tagLimitService)
    {
        _tagLimitService = tagLimitService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagLimitDto>>> GetTagLimits(long budgetId)
    {
        var userBudgetsMap = await _tagLimitService.GetTagLimits(budgetId);

        if (userBudgetsMap.Any())
        {
            return StatusCode(StatusCodes.Status200OK, userBudgetsMap);
        }

        return StatusCode(StatusCodes.Status204NoContent);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateBudgetTagLimits(long budgetId, TagLimitsUpdateDto updateTagLimitDto)
    {
        await _tagLimitService.UpdateBudgetTagLimits(budgetId, updateTagLimitDto);

        return StatusCode(StatusCodes.Status200OK);
    }
}
