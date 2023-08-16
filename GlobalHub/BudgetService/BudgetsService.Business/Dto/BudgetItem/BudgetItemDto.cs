using BudgetsService.DataAccess.Entities.Budget;
using BudgetsService.DataAccess.Enums.Budget;
using BudgetsService.DataAccess.Interface;

namespace BudgetsService.Business.Dto.BudgetItem;

public record BudgetItemDto : IHasDate
{
    public long Id { get; init; }

    public string ItemTitle { get; init; } = string.Empty;

    public string ItemDescription { get; init; } = string.Empty;

    public BudgetItemOperationType BudgetItemOperationType { get; init; }

    public BudgetItemRegularityType BudgetItemRegularityType { get; init; }

    public decimal BudgetOperationCost { get; init; }

    public DateTime PaymentDate { get; set; }

    public ICollection<Tag> Tags { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
