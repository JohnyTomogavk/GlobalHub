namespace BudgetDataLayer.Interface;

public interface IHasDate
{
    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
