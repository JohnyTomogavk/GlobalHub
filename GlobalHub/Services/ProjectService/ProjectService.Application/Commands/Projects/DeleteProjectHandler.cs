namespace ProjectService.Application.Commands.Projects;

public record DeleteProjectRequest(long ProjectId) : IRequest<long>;

/// <summary>
/// Handles project deletion
/// </summary>
public class DeleteProjectHandler : IRequestHandler<DeleteProjectRequest, long>
{
    private readonly ApplicationDbContext _applicationDbContext;

    public DeleteProjectHandler(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public async Task<long> Handle(DeleteProjectRequest request, CancellationToken cancellationToken)
    {
        var project = await _applicationDbContext.Projects.SingleOrDefaultAsync(
            project => project.Id == request.ProjectId,
            cancellationToken: cancellationToken);

        // TODO: Authorize project delete operation

        var removedProject = _applicationDbContext.Projects.Remove(project);

        await _applicationDbContext.SaveChangesAsync(cancellationToken);

        return removedProject.Entity.Id;
    }
}
