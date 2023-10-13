using System.Net;

namespace BudgetsService.Web.Controllers;

/// <summary>
/// Controller that manages tag limits
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class TagLimitsController : ControllerBase
{
    private readonly ITagLimitService _tagLimitService;

    public TagLimitsController(ITagLimitService tagLimitService)
    {
        _tagLimitService = tagLimitService;
    }

    /// <summary>
    /// Returns tag limits for budget
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Tag limits</returns>
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

    /// <summary>
    /// Updates tag limits for budget
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="tagLimitDtos">Tag limits' data</param>
    /// <returns>Operation result</returns>
    [HttpPut]
    public async Task<ActionResult> UpdateBudgetTagLimits(long budgetId, IEnumerable<TagLimitDto> tagLimitDtos)
    {
        await _tagLimitService.UpdateBudgetTagLimits(budgetId, tagLimitDtos);

        return StatusCode(StatusCodes.Status200OK);
    }
}
