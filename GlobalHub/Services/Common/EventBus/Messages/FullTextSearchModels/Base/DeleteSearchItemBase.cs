namespace Common.EventBus.Messages.FullTextSearchModels.Base;

public class DeleteSearchItemBase<TSearchItem> where TSearchItem : BaseSearchItem
{
    /// <summary>
    /// Document Id to delete
    /// </summary>
    public string[] DocumentIds { get; set; }
}
