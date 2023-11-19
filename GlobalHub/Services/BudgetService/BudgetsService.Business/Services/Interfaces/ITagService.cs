namespace BudgetsService.Business.Services.Interfaces;

/// <summary>
/// Service that manages tags
/// </summary>
public interface ITagService
{
    /// <summary>
    /// Gets budget tags
    /// </summary>
    /// <param name="budgetId">Budget id</param>
    /// <returns>Set of tag dtos</returns>
    public Task<IEnumerable<TagDto>> GetBudgetTags(long budgetId);

    /// <summary>
    /// Create new tag
    /// </summary>
    /// <param name="newTagDto">New tag data</param>
    /// <returns>Created tag's dto</returns>
    Task<TagDto> CreateNewTag(TagCreateDto newTagDto);

    /// <summary>
    /// Updates tag
    /// </summary>
    /// <param name="tagDto">Tag data to update</param>
    /// <returns>Updated tag dto</returns>
    Task<TagDto> UpdateTag(TagDto tagDto);

    /// <summary>
    /// Deletes tag
    /// </summary>
    /// <param name="tagId">Tag id</param>
    /// <returns>Deleted tag's id</returns>
    Task<long> DeleteTag(long tagId);
}
