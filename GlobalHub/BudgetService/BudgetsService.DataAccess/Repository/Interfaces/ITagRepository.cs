namespace BudgetsService.DataAccess.Repository.Interfaces;

/// <summary>
/// Repository that manages tags
/// </summary>
public interface ITagRepository
{
    /// <summary>
    /// Returns tags for specified budget id
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Set of tags</returns>
    Task<IEnumerable<Tag?>> GetTagsByBudgetId(long budgetId);

    /// <summary>
    /// Creates new tag
    /// </summary>
    /// <param name="newTag">New tag data</param>
    /// <returns>Created tag</returns>
    Task<Tag?> CreateNewTag(Tag? newTag);

    /// <summary>
    /// Updates tag
    /// </summary>
    /// <param name="tag">Tag to update</param>
    /// <returns>Updated tag</returns>
    Task<Tag?> UpdateTag(Tag? tag);

    /// <summary>
    /// Gets tag by id
    /// </summary>
    /// <param name="tagId">Tag id</param>
    /// <returns></returns>
    Task<Tag?> GetTagById(long tagId);

    /// <summary>
    /// Deletes tag by tag id
    /// </summary>
    /// <param name="tag">Tag id</param>
    /// <returns>Deletes tag's id</returns>
    Task<long> DeleteById(Tag tag);

    /// <summary>
    /// Gets expenses sums grouped by tag for specified period
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <param name="startRangeDate">Start date range</param>
    /// <param name="endRangeDate">End date range</param>
    /// <returns>Dictionary with key as tag id and sum of operation costs as a value</returns>
    Task<Dictionary<long, decimal>> GetExpensesSumsGroupedByTags(long budgetId, DateTime startRangeDate,
        DateTime endRangeDate);
}
