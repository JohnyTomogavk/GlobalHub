namespace BudgetsService.Web.Controllers;

/// <summary>
/// Controller that manages user's budgets
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class BudgetController : ControllerBase
{
    private readonly IBudgetService _budgetService;
    private readonly IDateTimeService _dateTimeService;

    public BudgetController(IBudgetService budgetService, IDateTimeService dateTimeService)
    {
        _budgetService = budgetService;
        _dateTimeService = dateTimeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BudgetMap>>> GetBudgetsMap()
    {
        var userBudgetsMap = await _budgetService.GetUserBudgetsMapAsync();

        return Ok(userBudgetsMap);
    }

    [HttpGet]
    public async Task<ActionResult<BudgetDto>> GetBudgetById(long id)
    {
        var userBudgetsMap = await _budgetService.GetBudgetByIdAsync(id);

        if (userBudgetsMap == null)
        {
            return NotFound();
        }

        return Ok(userBudgetsMap);
    }

    [HttpPost]
    public async Task<ActionResult<BudgetDto>> CreateNewBudget([FromBody] CreateBudgetDto newBudgetDto)
    {
        var createdBudget = await _budgetService.AddBudgetAsync(newBudgetDto);

        return StatusCode(StatusCodes.Status201Created, createdBudget);
    }

    [HttpGet]
    public async Task<ActionResult<BudgetAnalyticDto>> GetBudgetAnalyticForDateRange(long id)
    {
        var currentDate = _dateTimeService.CurrentDate;
        var currentMonthDateRange = _dateTimeService.GetDateTimeRangeByDate(currentDate);
        var analyticDto = await _budgetService.GetBudgetAnalytic(id, currentMonthDateRange);

        return Ok(analyticDto);
    }

    [HttpDelete]
    public async Task<ActionResult<long>> DeleteBudgetById(long budgetId)
    {
        var deletedId = await _budgetService.DeleteBudgetById(budgetId);

        if (deletedId == null)
        {
            return NoContent();
        }

        return Ok(deletedId);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateBudgetTitle(long budgetId, [FromBody] BudgetTitleUpdateDto titleDto)
    {
        await _budgetService.UpdateBudgetTitle(budgetId, titleDto.Title);

        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult> UpdateBudgetDescription(long budgetId,
        [FromBody] BudgetDescriptionUpdateDto descriptionUpdateDto)
    {
        await _budgetService.UpdateBudgetDescription(budgetId, descriptionUpdateDto.Description);

        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult<Budget>> UpdateBudgetPreservePercent(long budgetId,
        UpdateBudgetPreservePercentDto updateBudgetPreservePercentDto)
    {
        var budget = await _budgetService.UpdatePreservePercent(budgetId, updateBudgetPreservePercentDto);

        return Ok(budget);
    }
}
