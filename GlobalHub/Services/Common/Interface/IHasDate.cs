namespace Common.Interface;

/// <summary>
/// Tracks created and updated dates
/// </summary>
public interface IHasDate
{
    /// <summary>
    /// Date entity created at
    /// </summary>
    public DateTimeOffset CreatedDate { get; set; }

    /// <summary>
    /// Date entity updated at
    /// </summary>
    public DateTimeOffset? UpdatedDate { get; set; }
}
