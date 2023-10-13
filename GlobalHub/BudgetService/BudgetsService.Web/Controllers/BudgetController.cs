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

    /// <summary>
    /// Returns map of existing budgets for user that requests the map
    /// </summary>
    /// <returns>Set of maps that contains id and title for user's budgets</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BudgetMap>>> GetBudgetsMap()
    {
        var userBudgetsMap = await _budgetService.GetUserBudgetsMapAsync();

        return Ok(userBudgetsMap);
    }

    /// <summary>
    /// Returns budget by yd
    /// </summary>
    /// <param name="id">Budget id</param>
    /// <returns>Budget</returns>
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

    /// <summary>
    ///  Creates new budget
    /// </summary>
    /// <param name="newBudgetDto">Dto that contains info about budget that is going to be created</param>
    /// <returns>Create budget</returns>
    [HttpPost]
    public async Task<ActionResult<BudgetDto>> CreateNewBudget([FromBody] CreateBudgetDto newBudgetDto)
    {
        var createdBudget = await _budgetService.AddBudgetAsync(newBudgetDto);

        return StatusCode(StatusCodes.Status201Created, createdBudget);
    }

    /// <summary>
    /// Returns analytic metrics on budget by budget id
    /// </summary>
    /// <param name="id">Budget id</param>
    /// <returns>Analytic metrics on budget</returns>
    [HttpGet]
    public async Task<ActionResult<BudgetAnalyticDto>> GetBudgetAnalyticForDateRange(long id)
    {
        var currentDate = _dateTimeService.CurrentDate;
        var currentMonthDateRange = _dateTimeService.GetDateTimeRangeByDate(currentDate);
        var analyticDto = await _budgetService.GetBudgetAnalytic(id, currentMonthDateRange);

        return Ok(analyticDto);
    }

    /// <summary>
    /// Deletes budget by id
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Id of deleted budget</returns>
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

    /// <summary>
    /// Updates budget's title by id
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="titleDto">Dto that contains data related to title update</param>
    /// <returns>Operation status</returns>
    [HttpPut]
    public async Task<ActionResult> UpdateBudgetTitle(long budgetId, [FromBody] BudgetTitleUpdateDto titleDto)
    {
        await _budgetService.UpdateBudgetTitle(budgetId, titleDto.Title);

        return Ok();
    }

    /// <summary>
    /// Updates budget's description by id
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="descriptionUpdateDto">Dto that contains data related to description update</param>
    /// <returns>Operation status</returns>
    [HttpPut]
    public async Task<ActionResult> UpdateBudgetDescription(long budgetId,
        [FromBody] BudgetDescriptionUpdateDto descriptionUpdateDto)
    {
        await _budgetService.UpdateBudgetDescription(budgetId, descriptionUpdateDto.Description);

        return Ok();
    }

    /// <summary>
    /// Updates budget's preserve from incoming percent
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="updateBudgetPreservePercentDto">Contains data related to preserve percent update</param>
    /// <returns>Updated budget's dto</returns>
    [HttpPut]
    public async Task<ActionResult<BudgetDto>> UpdateBudgetPreservePercent(long budgetId,
        UpdateBudgetPreservePercentDto updateBudgetPreservePercentDto)
    {
        var budgetDto = await _budgetService.UpdatePreservePercent(budgetId, updateBudgetPreservePercentDto);

        return Ok(budgetDto);
    }
}
