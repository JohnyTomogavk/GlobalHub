using BudgetBusinessLayer.Dto.BudgetItem;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.Interface;

namespace BudgetBusinessLayer.Dto.Budget;

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
