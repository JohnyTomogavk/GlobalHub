namespace BudgetsService.Infrastructure.Interface;

public interface IHasCreator
{
    /// <summary>
    /// Used Id of user that created an entity
    /// </summary>
    public string? CreatedBy { get; set; }

    /// <summary>
    /// Used Id of user that updated an entity
    /// </summary>
    public string? UpdatedBy { get; set; }
}
