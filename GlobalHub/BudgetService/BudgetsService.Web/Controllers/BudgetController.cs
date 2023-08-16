using BudgetBusinessLayer.Dto.Budget;
using BudgetsService.Business.Dto.Budget;
using BudgetsService.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BudgetsService.Web.Controllers;

/// <summary>
/// Controller that manages user's budgets
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class BudgetController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
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
    public async Task<ActionResult<BudgetAnalyticDto>> GetCurrentBudgetState(long budgetId, DateTime requestedDate)
    {
        return Ok();
    }
}
