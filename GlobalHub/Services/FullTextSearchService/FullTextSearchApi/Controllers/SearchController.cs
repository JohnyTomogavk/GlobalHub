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
    public async Task<ActionResult<SearchResultsDto>> Search(string searchString = "")
    {
        if (string.IsNullOrEmpty(searchString))
        {
            return this.StatusCode(StatusCodes.Status204NoContent);
        }

        var userId = this._userService.UserId;

        var foundDocsResponse = await this._elasticClient.MultiSearchAsync(selector: ms =>
        {
            ms.Search<ProjectSearchItem>(ProjectsSearchName, search =>
            {
                search.Highlight(h =>
                    h.PreTags("<em><strong>")
                        .PostTags("</strong></em>")
                        .Fields(
                            fh => fh.Field(f => f.Title),
                            fh => fh.Field(f => f.Tags)));

                search.Query(q =>
                    (q.Match(match =>
                         match.Field(o => o.Title).Query(searchString).Fuzziness(Fuzziness.Auto))
                     || q.Term(t => t.Tags, searchString))
                    && +q.Term(t => t.UserId, userId));

                return search;
            });

            ms.Search<ProjectItemSearchItem>(ProjectItemsSearchName, search =>
                search.Highlight(h =>
                        h.PreTags("<em><strong>")
                            .PostTags("</strong></em>")
                            .Fields(
                                fields => fields.Field(f => f.ProjectItemTitle),
                                fields => fields.Field(f => f.Tags))
                            .Order(HighlighterOrder.Score)
                            .NumberOfFragments(1))
                    .Query(q =>
                        (q.Match(match =>
                             match.Field(o => o.ProjectItemTitle)
                                 .Query(searchString)
                                 .Fuzziness(Fuzziness.Auto)
                                 .FuzzyTranspositions())
                         || q.Term(t => t.Tags, searchString))
                        && +q.Term(t => t.UserId, userId)));

            ms.Search<BudgetSearchItem>(BudgetSearchName, search =>
                search.Highlight(h =>
                        h.PreTags("<em><strong>")
                            .PostTags("</strong></em>")
                            .Fields(
                                fields => fields.Field(f => f.Title)))
                    .Query(q =>
                        q.Match(match =>
                            match.Field(o => o.Title)
                                .Query(searchString)
                                .Fuzziness(Fuzziness.Auto)
                                .FuzzyTranspositions())
                        && +q.Term(t => t.UserId, userId)));

            ms.Search<BudgetItemSearchItem>(BudgetItemsSearchName, search =>
                search.Highlight(h =>
                        h.PreTags("<em><strong>")
                            .PostTags("</strong></em>")
                            .Fields(
                                fields => fields.Field(f => f.BudgetItemTitle),
                                fields => fields.Field(f => f.OperationCost),
                                fields => fields.Field(f => f.Tags)))
                    .Query(q =>
                    (
                        (q.Match(match =>
                             match.Field(o => o.BudgetItemTitle)
                                 .Fuzziness(Fuzziness.Auto)
                                 .FuzzyTranspositions()
                                 .Query(searchString))
                         || q.Match(m =>
                             m.Field(f => f.OperationCost)
                                 .Lenient()
                                 .Query(searchString))
                         || q.Match(m =>
                             m.Field(o => o.Tags)
                                 .Query(searchString)))
                        && +q.Term(t => t.UserId, userId))));

            ms.Search<NoteSearchItem>(NoteSearchName, search =>
                search.Highlight(h =>
                        h.PreTags("<em><strong>")
                            .PostTags("</strong></em>")
                            .Fields(
                                fields => fields.Field(f => f.Title),
                                fields => fields.Field(f => f.Content)
                                    .Order(HighlighterOrder.Score)
                                    .FragmentSize(25)))
                    .Query(q =>
                        (q.Match(match =>
                             match.Field(o => o.Title)
                                 .Fuzziness(Fuzziness.Auto)
                                 .FuzzyTranspositions()
                                 .Query(searchString))
                         || q.Match(m =>
                             m.Field(o => o.Content)
                                 .Boost(1.5)
                                 .Fuzziness(Fuzziness.Auto)
                                 .Query(searchString)))
                        && +q.Term(t => t.UserId, userId)));

            return ms;
        });

        var searchItems = this.GetSearchResults(foundDocsResponse);

        return this.StatusCode(StatusCodes.Status200OK, searchItems);
    }

    private SearchResultsDto GetSearchResults(MultiSearchResponse multiSearchResponse)
    {
        var docs = new SearchResultsDto
        {
            ProjectSearchItems =
                this.GetSearchResponse<ProjectSearchItem>(multiSearchResponse, ProjectsSearchName),
            ProjectItemSearchItems =
                this.GetSearchResponse<ProjectItemSearchItem>(multiSearchResponse, ProjectItemsSearchName),
            BudgetSearchItems =
                this.GetSearchResponse<BudgetSearchItem>(multiSearchResponse, BudgetSearchName),
            BudgetItemSearchItems =
                this.GetSearchResponse<BudgetItemSearchItem>(multiSearchResponse, BudgetItemsSearchName),
            NoteSearchItems =
                this.GetSearchResponse<NoteSearchItem>(multiSearchResponse, NoteSearchName),
        };

        return docs;
    }

    private IEnumerable<TSearch> GetSearchResponse<TSearch>(
        MultiSearchResponse multiSearchResponse,
        string searchName)
        where TSearch : BaseSearchItem
    {
        var documentsFound = multiSearchResponse.GetResponse<TSearch>(searchName).Documents;
        var hits = multiSearchResponse.GetResponse<TSearch>(searchName).Hits;

        var enrichedDocs = documentsFound.Select((document, index) =>
        {
            var documentHighlights = hits.ElementAt(index).Highlight;
            var highlight = documentHighlights.Values.FirstOrDefault()?.FirstOrDefault();
            document.Highlight = highlight;

            return document;
        }).ToList();

        return enrichedDocs;
    }
}
