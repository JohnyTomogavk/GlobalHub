namespace BudgetsService.DataAccess.Extensions;

public static class BudgetItemExtensions
{
    public static IEnumerable<BudgetItem> IsOperationDateBetween(
        this IEnumerable<BudgetItem> budgetItems,
        DateTime startDateRange,
        DateTime endDateRange)
    {
        return budgetItems.Where(item =>
            item.OperationDate.Date >= startDateRange.Date && item.OperationDate.Date <= endDateRange.Date);
    }
}
