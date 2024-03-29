﻿namespace BudgetsService.DataAccess.Constants;

/// <summary>
/// Contains some constants related to budgets
/// </summary>
public static class BudgetConstants
{
    // Rules related to Budget entity
    public const int MaxBudgetTitleLength = 50;
    public const int MaxBudgetDescriptionLength = 255;

    // Rules related to BudgetItem entity
    public const int MaxBudgetItemTitleLength = 50;
    public const int MaxBudgetItemDescriptionLength = 255;
}
