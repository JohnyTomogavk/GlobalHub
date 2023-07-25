﻿using BudgetBusinessLayer.Dto.Budget;

namespace BudgetBusinessLayer.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync();

    Task<BudgetDto> GetBudgetByIdAsync(long budgetId);
}
