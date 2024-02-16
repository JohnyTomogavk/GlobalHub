namespace ProjectService.Application.Commands.ProjectItems;

public record CreateEventRequest : BaseProjectItemCreateRequest, ITransactional;

public class CreateEventHandler : BaseCreateProjectItemRequestHandler<CreateEventRequest, ProjectItemDto>
{
    public CreateEventHandler(
        ApplicationDbContext dbContext,
        IValidator<CreateEventRequest> validator,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService)
        : base(dbContext, validator, mapper, userService, projectAuthorizationService)
    {
    }
}
