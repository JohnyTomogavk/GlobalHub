namespace ProjectService.Application.Services.Interfaces;

public interface IProjectItemFullTextSearchIndexService : IFullTextIndexService<ProjectItem>
{
    Task RemoveManyEntityFromIndex(IEnumerable<string> entityIds);
}
