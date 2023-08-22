﻿namespace BudgetsService.Business.Dto.BudgetItems;

public record BudgetItemDto : IHasDate
{
    public long Id { get; init; }

    public string ItemTitle { get; init; } = string.Empty;

    public string ItemDescription { get; init; } = string.Empty;

    public BudgetItemOperationType BudgetItemOperationType { get; init; }

    public BudgetItemRegularityType BudgetItemRegularityType { get; init; }

    public decimal BudgetOperationCost { get; init; }

    public DateTime PaymentDate { get; set; }

    public IEnumerable<long> TagIds { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
