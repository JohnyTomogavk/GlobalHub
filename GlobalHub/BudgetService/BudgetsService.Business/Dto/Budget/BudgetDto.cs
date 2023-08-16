using BudgetsService.Business.Dto.BudgetItem;
using BudgetsService.DataAccess.Interface;

namespace BudgetsService.Business.Dto.Budget;

public record BudgetDto : IHasDate
{
    public long Id { get; init; }

    public string BudgetTitle { get; init; }

    public string BudgetDescription { get; init; }

    public ICollection<BudgetItemDto> BudgetItems { get; set; }

    public int PreserveFromIncomingPercent { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
