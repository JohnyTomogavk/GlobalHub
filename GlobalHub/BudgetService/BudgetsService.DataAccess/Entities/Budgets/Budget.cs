using BudgetsService.DataAccess.Entities.Base;
using BudgetsService.DataAccess.Entities.Tags;
using BudgetsService.Infrastructure.Interface;

namespace BudgetsService.DataAccess.Entities.Budgets;

public class Budget : BaseEntity, IHasDate
{
    public string BudgetTitle { get; set; } = string.Empty;

    public string BudgetDescription { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public int PreserveFromIncomingPercent { get; set; }

    public virtual IEnumerable<BudgetItem> BudgetItems { get; set; } = new List<BudgetItem>();

    public virtual IEnumerable<Tag> BudgetTags { get; set; } = new List<Tag>();
}
