namespace BudgetsService.Infrastructure.Interface;

/// <summary>
/// Tracks created and updated dates
/// </summary>
public interface IHasDate
{
    /// <summary>
    /// Date entity created at
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Date entity updated at
    /// </summary>
    public DateTime? UpdatedDate { get; set; }
}
