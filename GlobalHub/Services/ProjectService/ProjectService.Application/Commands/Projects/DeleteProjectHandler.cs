namespace ProjectService.Application.Commands.Projects;

public record DeleteProjectRequest(long ProjectId) : IRequest<long>;

/// <summary>
/// Handles project deletion
/// </summary>
public class DeleteProjectHandler : IRequestHandler<DeleteProjectRequest, long>
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IAuthorizationService<Project> _projectAuthService;
    private readonly IUserService _userService;
    private readonly IFullTextIndexService<Project> _fullTextIndexService;

    public DeleteProjectHandler(
        ApplicationDbContext applicationDbContext,
        IAuthorizationService<Project> projectAuthService,
        IUserService userService,
        IFullTextIndexService<Project> fullTextIndexService)
    {
        this._applicationDbContext = applicationDbContext;
        this._projectAuthService = projectAuthService;
        this._userService = userService;
        this._fullTextIndexService = fullTextIndexService;
    }

    public async Task<long> Handle(DeleteProjectRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized = await this._projectAuthService.AuthorizeDelete(this._userService.UserId, request.ProjectId);

        if (!isAuthorized)
        {
            throw new AccessDeniedException();
        }

        var project = await this._applicationDbContext.Projects.SingleOrDefaultAsync(
            project => project.Id == request.ProjectId,
            cancellationToken: cancellationToken);

        var removedProject = this._applicationDbContext.Projects.Remove(project);
        await this._applicationDbContext.SaveChangesAsync(cancellationToken);
        await this._fullTextIndexService.RemoveEntityFromIndex(request.ProjectId);

        return removedProject.Entity.Id;
    }
}
