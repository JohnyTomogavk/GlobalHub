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

    public BudgetItemController(IBudgetItemService budgetItemService, ITagService tagService,
        IDateTimeService dateTimeService)
    {
        _budgetItemService = budgetItemService;
        _dateTimeService = dateTimeService;
    }

    [HttpPut]
    public async Task<ActionResult<BudgetItemPaginatedResponse>> GetBudgetItemsByBudgetId(long id,
        [FromBody] BudgetItemsQueryOptions? budgetItemsQueryOptions)
    {
        var budgetItems =
            await _budgetItemService.GetBudgetItemsByBudgetId(id, budgetItemsQueryOptions);

        return Ok(budgetItems);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseOperationsSumDto>>> GetCurrentMonthExpensesSumsGroupedByTags(
        long budgetId)
    {
        var currentDate = _dateTimeService.CurrentDate;
        var currentBudgetPeriod = _dateTimeService.GetDateTimeRangeByDate(currentDate);

        var sums = await _budgetItemService.GetExpensesSumsGroupedByTags(budgetId, currentBudgetPeriod);

        if (!sums.Any())
        {
            return StatusCode(StatusCodes.Status204NoContent);
        }

        return StatusCode(StatusCodes.Status200OK, sums);
    }

    [HttpPost]
    public async Task<ActionResult<BudgetItemDto>> CreateBudgetItem(BudgetItemCreateDto createDto)
    {
        var createdBudgetItemDto = await _budgetItemService.CreateBudgetItem(createDto);
        var updatedBudgetItem =
            await _budgetItemService.UpdateBudgetItemTags(createdBudgetItemDto.Id, createDto.TagIds);

        return StatusCode(StatusCodes.Status201Created, updatedBudgetItem);
    }

    [HttpPut]
    public async Task<ActionResult<BudgetItemDto>> UpdateBudgetItem(BudgetItemUpdateDto updateDto)
    {
        await _budgetItemService.UpdateBudgetItem(updateDto);
        var updatedBudgetItem = await _budgetItemService.UpdateBudgetItemTags(updateDto.Id, updateDto.TagIds);

        return Ok(updatedBudgetItem);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteBudgetItem(long budgetItemId)
    {
        await _budgetItemService.DeleteBudgetItem(budgetItemId);

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BudgetItemDto>>> GetBudgetItemsByIdAndRange(
        long budgetId, DateTime startDateRange, DateTime endDateRange)
    {
        var budgetItems = await _budgetItemService.GetBudgetItemsByIdAndRange(budgetId, startDateRange, endDateRange);

        if (!budgetItems.Any())
        {
            return StatusCode(StatusCodes.Status204NoContent);
        }

        return StatusCode(StatusCodes.Status200OK, budgetItems);
    }
}
