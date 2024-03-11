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
    private readonly IFullTextIndexService<BudgetItem> _bFullTextIndexService;

    public BudgetItemController(
        IBudgetItemService budgetItemService,
        IDateTimeService dateTimeService,
        IFullTextIndexService<BudgetItem> bFullTextIndexService)
    {
        _budgetItemService = budgetItemService;
        _dateTimeService = dateTimeService;
        _bFullTextIndexService = bFullTextIndexService;
    }

    /// <summary>
    /// Returns budget items by budget id applying sort, filtering and pagination
    /// </summary>
    /// <param name="id">Budget id</param>
    /// <param name="budgetItemsQueryOptions">Options related to pagination, sorting and filtering</param>
    /// <returns>Model that contains paginated set of budget items and aggregation metrics</returns>
    [HttpPut]
    public async Task<ActionResult<BudgetItemPaginatedResponse>> GetBudgetItemsByBudgetId(long id,
        [FromBody] BudgetItemsQueryOptions? budgetItemsQueryOptions)
    {
        var budgetItemsPaginatedResponseDto =
            await _budgetItemService.GetBudgetItemsByBudgetId(id, budgetItemsQueryOptions);

        return StatusCode(StatusCodes.Status200OK, budgetItemsPaginatedResponseDto);
    }

    /// <summary>
    /// Returns models containing expenses sums grouped by tag id's
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Expenses sums grouped by tag id</returns>
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

    /// <summary>
    /// Creates new budget item
    /// </summary>
    /// <param name="createDto">New budget's initial data</param>
    /// <returns>Created budget item dto</returns>
    [HttpPost]
    public async Task<ActionResult<BudgetItemDto>> CreateBudgetItem(BudgetItemCreateDto createDto)
    {
        var createdBudgetItemDto = await _budgetItemService.CreateBudgetItem(createDto);
        await this._bFullTextIndexService.IndexCreatedEntity(createdBudgetItemDto.Id);

        return StatusCode(StatusCodes.Status201Created, createdBudgetItemDto);
    }

    /// <summary>
    /// Updates budget item
    /// </summary>
    /// <param name="updateDto">Budget item's data</param>
    /// <returns>Updated budget item's data</returns>
    [HttpPut]
    public async Task<ActionResult<BudgetItemDto>> UpdateBudgetItem(BudgetItemUpdateDto updateDto)
    {
        await _budgetItemService.UpdateBudgetItem(updateDto);
        var updatedBudgetItem = await _budgetItemService.UpdateBudgetItemTags(updateDto.Id, updateDto.TagIds);
        await this._bFullTextIndexService.UpdateIndexedEntity(updatedBudgetItem.Id);

        return StatusCode(StatusCodes.Status200OK, updatedBudgetItem);
    }

    /// <summary>
    /// Deletes budget item by id
    /// </summary>
    /// <param name="budgetItemId">Budget item id</param>
    /// <returns>Delete operation result</returns>
    [HttpDelete]
    public async Task<ActionResult> DeleteBudgetItem(long budgetItemId)
    {
        await _budgetItemService.DeleteBudgetItem(budgetItemId);
        await this._bFullTextIndexService.UpdateIndexedEntity(budgetItemId);

        return StatusCode(StatusCodes.Status200OK, budgetItemId);
    }

    /// <summary>
    /// Returns budget items by budget id and date range
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="startDateRange">Start date range</param>
    /// <param name="endDateRange">End date range</param>
    /// <returns>Budget items' dtos</returns>
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
