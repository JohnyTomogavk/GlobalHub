using BudgetsService.Business.Services.Interfaces;
using BudgetsService.DataAccess.Entities.Budget;
using Microsoft.AspNetCore.Mvc;

namespace BudgetsService.Web.Controllers;

/// <summary>
/// Controller that manages user's budgets
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class BudgetItemController : ControllerBase
{
    private readonly IBudgetItemService _budgetItemService;

    public BudgetItemController(IBudgetItemService budgetItemService)
    {
        _budgetItemService = budgetItemService;
    }

    public async Task<ICollection<BudgetItem>> GetBudgetItemsByBudgetId(long id)
    {
        return null;
    }
}
