namespace ProjectService.Application.Commands.ProjectItems;

public record CreateEventRequest : BaseProjectItemCreateRequest, ITransactional;

public class CreateEventHandler : BaseCreateProjectItemRequestHandler<CreateEventRequest, ProjectItemDto>
{
    public CreateEventHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService)
        : base(dbContext, mapper, userService, projectAuthorizationService)
    {
    }
}
