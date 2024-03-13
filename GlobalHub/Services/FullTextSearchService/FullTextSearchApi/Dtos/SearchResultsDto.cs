namespace FullTextSearchApi.Dtos;

public record SearchResultsDto
{
    public IEnumerable<ProjectSearchItem> ProjectSearchItems { get; set; }
    public IEnumerable<ProjectItemSearchItem> ProjectItemSearchItems { get; set; }
    public IEnumerable<BudgetSearchItem> BudgetSearchItemS { get; set; }
    public IEnumerable<BudgetItemSearchItem> BudgetItemSearchItems { get; set; }
    public IEnumerable<NoteSearchItem> NoteSearchItems { get; set; }
}
