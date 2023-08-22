namespace BudgetsService.Business.Dto.Budget;

public record BudgetAnalyticDto
{
    public decimal MoneyLeft { get; init; }

    public decimal MoneyPreserved { get; init; }

    public decimal IrregularExpenses { get; init; }

    public decimal RegularExpenses { get; init; }

    public decimal AverageDailyExpenses { get; init; }

    public decimal ExpensesMedian { get; init; }
}
