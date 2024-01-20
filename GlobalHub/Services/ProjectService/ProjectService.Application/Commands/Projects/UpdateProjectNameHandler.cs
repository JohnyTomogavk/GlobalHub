namespace ProjectService.Application.Commands.Projects;

public record UpdateProjectNameRequest(long ProjectId, string NewTitle) : IRequest<ProjectDto>;

/// <summary>
/// Renames project
/// </summary>
public class UpdateProjectNameHandler : IRequestHandler<UpdateProjectNameRequest, ProjectDto>
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public UpdateProjectNameHandler(ApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }

    public async Task<ProjectDto> Handle(UpdateProjectNameRequest request, CancellationToken cancellationToken)
    {
        var project = await _applicationDbContext.Projects.SingleOrDefaultAsync(
            p => p.Id == request.ProjectId,
            cancellationToken: cancellationToken);

        // TODO: Authorize access to project when auth service is implemented

        project.Title = request.NewTitle;

        await _applicationDbContext.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ProjectDto>(project);
    }
}
