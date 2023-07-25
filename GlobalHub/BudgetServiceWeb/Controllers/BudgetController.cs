using BudgetBusinessLayer.Dto.Budget;
using BudgetBusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BudgetService.Controllers;

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
    public async Task<IEnumerable<BudgetMap>> GetBudgetsMap()
    {
        var userBudgetsMap = await _budgetService.GetUserBudgetsMapAsync();

        return userBudgetsMap;
    }

    [HttpGet]
    public async Task<BudgetDto> GetBudgetById(long id)
    {
        var userBudgetsMap = await _budgetService.GetBudgetByIdAsync(id);

        return userBudgetsMap;
    }
}
