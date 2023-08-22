using BudgetsService.Business.Dto.Tag;
using BudgetsService.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
}
