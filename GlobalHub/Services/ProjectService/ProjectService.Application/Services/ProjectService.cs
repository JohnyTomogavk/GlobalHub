namespace ProjectService.Application.Services;

public class ProjectService : BaseService<Project>, IProjectService
{
    public ProjectService(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
