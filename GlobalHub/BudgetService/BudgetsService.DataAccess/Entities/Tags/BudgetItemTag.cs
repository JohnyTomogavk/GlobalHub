namespace BudgetsService.DataAccess.Entities.Tags;

public class BudgetItemTag : BaseEntity
{
    public long TagId { get; set; }

    public long BudgetItemId { get; set; }

    public Tag Tag { get; set; }

    public BudgetItem BudgetItem { get; set; }
}
