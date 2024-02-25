namespace ProjectService.Application.Commands.ProjectItems;

public record DeleteProjectItemRequest(long[] ProjectItemIds) : IRequest<long[]>;

public class DeleteProjectItemHandler : IRequestHandler<DeleteProjectItemRequest, long[]>
{
    private readonly IAuthorizationService<ProjectItem> _authorizationService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IUserService _userService;

    public DeleteProjectItemHandler(
        IAuthorizationService<ProjectItem> authorizationService,
        ApplicationDbContext dbContext,
        IUserService userService)
    {
        this._authorizationService = authorizationService;
        this._dbContext = dbContext;
        this._userService = userService;
    }

    public async Task<long[]> Handle(DeleteProjectItemRequest request, CancellationToken cancellationToken)
    {
        foreach (var projectItemId in request.ProjectItemIds)
        {
            var isAuthorized =
                await this._authorizationService.AuthorizeDelete(this._userService.UserId, projectItemId);

            if (!isAuthorized)
            {
                throw new AccessDeniedException();
            }
        }

        var projectItemsToDelete =
            this._dbContext.ProjectItems.Where(
                t => request.ProjectItemIds.Contains(t.Id));

        this._dbContext.ProjectItems.RemoveRange(projectItemsToDelete);
        await this._dbContext.SaveChangesAsync(cancellationToken);

        return request.ProjectItemIds;
    }
}
