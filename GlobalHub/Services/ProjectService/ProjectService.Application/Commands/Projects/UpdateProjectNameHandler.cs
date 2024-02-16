namespace ProjectService.Application.Commands.Projects;

public record UpdateProjectNameRequest(long ProjectId, string NewTitle) : IRequest<ProjectDto>;

/// <summary>
/// Renames project
/// </summary>
public class UpdateProjectNameHandler : IRequestHandler<UpdateProjectNameRequest, ProjectDto>
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;
    private readonly IUserService _userService;
    private readonly IAuthorizationService<Project> _projectAuthorizationService;

    public UpdateProjectNameHandler(
        ApplicationDbContext applicationDbContext,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService)
    {
        this._applicationDbContext = applicationDbContext;
        this._mapper = mapper;
        this._userService = userService;
        this._projectAuthorizationService = projectAuthorizationService;
    }

    public async Task<ProjectDto> Handle(UpdateProjectNameRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized =
            await this._projectAuthorizationService.AuthorizeUpdate(this._userService.UserId, request.ProjectId);

        if (!isAuthorized)
        {
            throw new UnauthorizedAccessException();
        }

        var project = await this._applicationDbContext.Projects.SingleOrDefaultAsync(
            p => p.Id == request.ProjectId,
            cancellationToken: cancellationToken);

        project.Title = request.NewTitle;

        await this._applicationDbContext.SaveChangesAsync(cancellationToken);

        return this._mapper.Map<ProjectDto>(project);
    }
}
