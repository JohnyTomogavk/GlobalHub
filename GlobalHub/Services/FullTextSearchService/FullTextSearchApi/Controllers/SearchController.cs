namespace FullTextSearchApi.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class SearchController : ControllerBase
{
    private const string ProjectsSearchName = "project";
    private const string ProjectItemsSearchName = "projectItem";
    private const string BudgetSearchName = "budget";
    private const string BudgetItemsSearchName = "budgetItem";
    private const string NoteSearchName = "note";

    private readonly IElasticClient _elasticClient;
    private readonly IUserService _userService;

    public SearchController(IElasticClient elasticClient, IUserService userService)
    {
        this._elasticClient = elasticClient;
        this._userService = userService;
    }

    /// <summary>
    /// Performs queries to elastic search
    /// </summary>
    /// <param name="searchString">User's query string.</param>
    /// <returns>Composed search results.</returns>
    [HttpGet]
    public async Task<ActionResult<SearchResultsDto>> Search(string searchString)
    {
        if (string.IsNullOrEmpty(searchString))
        {
            return this.StatusCode(StatusCodes.Status204NoContent);
        }

        var userId = this._userService.UserId;

        var foundDocsResponse = await this._elasticClient.MultiSearchAsync(selector: ms =>
        {
            ms.Search<ProjectSearchItem>(ProjectsSearchName, search =>
                search.Query(q =>
                    (q.Match(match =>
                         match.Field(o => o.Title)
                             .Fuzziness(Fuzziness.Auto)
                             .Query(searchString))
                     || q.Term(t => t.Tags, searchString))
                    && +q.Term(t => t.UserId, userId)));

            ms.Search<ProjectItemSearchItem>(ProjectItemsSearchName, search =>
                search.Query(q =>
                    (q.Match(match =>
                         match.Field(o => o.ProjectItemTitle)
                             .Fuzziness(Fuzziness.Auto)
                             .FuzzyTranspositions()
                             .Query(searchString))
                     || q.Term(t => t.Tags, searchString))
                    && +q.Term(t => t.UserId, userId)));

            ms.Search<BudgetSearchItem>(BudgetSearchName, search =>
                search.Query(q =>
                    q.Match(match =>
                        match.Field(o => o.Title)
                            .Fuzziness(Fuzziness.Auto)
                            .FuzzyTranspositions()
                            .MinimumShouldMatch(MinimumShouldMatch.Fixed(2))
                            .Query(searchString))
                    && +q.Term(t => t.UserId, userId)));

            ms.Search<BudgetItemSearchItem>(BudgetItemsSearchName, search =>
                search.Query(q =>
                    (q.Match(match =>
                         match.Field(o => o.BudgetItemTitle)
                             .Fuzziness(Fuzziness.Auto)
                             .FuzzyTranspositions()
                             .MinimumShouldMatch(MinimumShouldMatch.Fixed(2))
                             .Query(searchString))
                     || q.Term(t => t.OperationCost, searchString)
                     || q.Term(t => t.Tags, searchString))
                    && +q.Term(t => t.UserId, userId)));

            ms.Search<NoteSearchItem>(NoteSearchName, search =>
                search.Query(q =>
                    (q.Match(match =>
                         match.Field(o => o.Title)
                             .Fuzziness(Fuzziness.Auto)
                             .FuzzyTranspositions()
                             .Query(searchString))
                     || q.Match(m =>
                         m.Field(o => o.Content)
                             .Fuzziness(Fuzziness.Auto)
                             .FuzzyTranspositions()
                             .Query(searchString).Analyzer("html_analyzer")))
                    && +q.Term(t => t.UserId, userId)));

            return ms;
        });

        var searchItems = this.GetSearchResults(foundDocsResponse);

        return this.StatusCode(StatusCodes.Status200OK, searchItems);
    }

    private SearchResultsDto GetSearchResults(
        MultiSearchResponse multiSearchResponse)
    {
        var docs = new SearchResultsDto
        {
            ProjectSearchItems = multiSearchResponse.GetResponse<ProjectSearchItem>(ProjectsSearchName).Documents,
            ProjectItemSearchItems =
                multiSearchResponse.GetResponse<ProjectItemSearchItem>(ProjectItemsSearchName).Documents,
            BudgetSearchItemS = multiSearchResponse.GetResponse<BudgetSearchItem>(BudgetSearchName).Documents,
            BudgetItemSearchItems =
                multiSearchResponse.GetResponse<BudgetItemSearchItem>(BudgetItemsSearchName).Documents,
            NoteSearchItems = multiSearchResponse.GetResponse<NoteSearchItem>(NoteSearchName).Documents,
        };

        return docs;
    }
}
