using BudgetDataLayer.Interface;

namespace BudgetBusinessLayer.Dto.Budget;

public record CreateBudgetDto
{
    public string BudgetTitle { get; init; }

    public DateTime CreatedDate { get; set; }
}
