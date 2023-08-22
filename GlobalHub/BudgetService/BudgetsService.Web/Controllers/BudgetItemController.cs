namespace BudgetsService.Web.Controllers;

/// <summary>
/// Controller that manages budget items
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class BudgetItemController : ControllerBase
{
    private readonly IBudgetItemService _budgetItemService;
    private readonly IDateTimeService _dateTimeService;

    public BudgetItemController(IBudgetItemService budgetItemService, IDateTimeService dateTimeService)
    {
        _budgetItemService = budgetItemService;
        _dateTimeService = dateTimeService;
    }

    [HttpPut]
    public async Task<ActionResult<IEnumerable<BudgetItemDto>>> GetBudgetItemsByBudgetId(long id,
        [FromBody] BudgetItemsQueryOptions? budgetItemsQueryOptions)
    {
        var currentDate = _dateTimeService.CurrentDate;
        var currentBudgetPeriod = _dateTimeService.GetDateTimeRangeByDate(currentDate);
        var budgetItems =
            await _budgetItemService.GetBudgetItemsByBudgetId(id, currentBudgetPeriod, budgetItemsQueryOptions);

        return Ok(budgetItems);
    }
}
