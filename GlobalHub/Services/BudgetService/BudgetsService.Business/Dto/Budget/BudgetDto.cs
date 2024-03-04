using Common.Interface;

namespace BudgetsService.Business.Dto.Budget;

public record BudgetDto : IHasDate, IHasCreator
{
    public long Id { get; init; }

    public string BudgetTitle { get; init; }

    public string BudgetDescription { get; init; }

    public IEnumerable<BudgetItemDto> BudgetItems { get; init; }

    public int PreserveFromIncomingPercent { get; init; }

    public DateTimeOffset CreatedDate { get; set; }

    public DateTimeOffset? UpdatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }
}
