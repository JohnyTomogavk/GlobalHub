namespace ProjectService.Application.Commands.ProjectItems;

public record CreateTaskRequest : BaseProjectItemCreateRequest, ITransactional
{
    public ETaskStatus TaskStatus { get; init; }

    public long? ParentProjectItemId { get; init; }
}

public class CreateTaskHandler : BaseCreateProjectItemRequestHandler<CreateTaskRequest, ProjectItemDto>
{
    public CreateTaskHandler(
        ApplicationDbContext dbContext,
        IValidator<CreateTaskRequest> validator,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService)
        : base(dbContext, validator, mapper, userService, projectAuthorizationService)
    {
    }
}
