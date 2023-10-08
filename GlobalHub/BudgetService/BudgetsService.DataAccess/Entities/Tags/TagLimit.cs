namespace BudgetsService.DataAccess.Entities.Tags;

public class TagLimit : BaseEntity
{
    public decimal MaxExpenseOperationsSum { get; set; }

    public virtual Tag Tag { get; set; }
}
