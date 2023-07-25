﻿using BudgetDataLayer.Entities.Budget;

namespace BudgetDataLayer.Repository.Interfaces;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget?>> GetUserBudgetsAsync();

    Task<Budget?> GetBudgetByIdAsync(long id);
}
