namespace BudgetsService.Business.Dto.TagLimit;

public record TagLimitDto
{
    public long Id { get; init; }

    public decimal MaxExpenseOperationsSum { get; init; }
}
