namespace FullTextSearchApi.Dtos;

public record SearchResultsDto
{
    public IEnumerable<ProjectSearchItem> ProjectSearchItems { get; init; }
    public IEnumerable<ProjectItemSearchItem> ProjectItemSearchItems { get; init; }
    public IEnumerable<BudgetSearchItem> BudgetSearchItems { get; init; }
    public IEnumerable<BudgetItemSearchItem> BudgetItemSearchItems { get; init; }
    public IEnumerable<NoteSearchItem> NoteSearchItems { get; init; }
}
