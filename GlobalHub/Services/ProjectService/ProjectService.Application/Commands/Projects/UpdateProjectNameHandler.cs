﻿namespace ProjectService.Application.Commands.Projects;

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
    private readonly IFullTextIndexService<Project> _fullTextIndexService;

    public UpdateProjectNameHandler(
        ApplicationDbContext applicationDbContext,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService,
        IFullTextIndexService<Project> fullTextIndexService)
    {
        this._applicationDbContext = applicationDbContext;
        this._mapper = mapper;
        this._userService = userService;
        this._projectAuthorizationService = projectAuthorizationService;
        this._fullTextIndexService = fullTextIndexService;
    }

    public async Task<ProjectDto> Handle(UpdateProjectNameRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized =
            await this._projectAuthorizationService.AuthorizeUpdate(this._userService.UserId, request.ProjectId);

        if (!isAuthorized)
        {
            throw new AccessDeniedException();
        }

        var project = await this._applicationDbContext.Projects.SingleOrDefaultAsync(
            p => p.Id == request.ProjectId,
            cancellationToken: cancellationToken);

        project.Title = request.NewTitle;

        await this._applicationDbContext.SaveChangesAsync(cancellationToken);
        await this._fullTextIndexService.UpdateIndexedEntity(project.Id);

        return this._mapper.Map<ProjectDto>(project);
    }
}
