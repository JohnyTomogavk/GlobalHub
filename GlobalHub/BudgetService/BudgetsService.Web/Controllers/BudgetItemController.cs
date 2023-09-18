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
    public async Task<ActionResult<BudgetItemPaginatedResponse>> GetBudgetItemsByBudgetId(long id,
        [FromBody] BudgetItemsQueryOptions? budgetItemsQueryOptions)
    {
        var currentDate = _dateTimeService.CurrentDate;
        var currentBudgetPeriod = _dateTimeService.GetDateTimeRangeByDate(currentDate);
        var budgetItems =
            await _budgetItemService.GetBudgetItemsByBudgetId(id, currentBudgetPeriod, budgetItemsQueryOptions);

        return Ok(budgetItems);
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
}
