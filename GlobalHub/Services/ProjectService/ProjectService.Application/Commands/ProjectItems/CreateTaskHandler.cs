namespace ProjectService.Application.Commands.ProjectItems;

public record CreateTaskRequest : BaseProjectItemCreateRequest, ITransactional
{
    public ETaskStatus TaskStatus { get; init; }

    public long? ParentProjectItemId { get; init; }
}

public class CreateTaskHandler : BaseProjectItemRequestHandler<CreateTaskRequest, ProjectItemDto>
{
    public CreateTaskHandler(
        ApplicationDbContext dbContext,
        IValidator<CreateTaskRequest> validator,
        IMapper mapper)
        : base(dbContext, validator, mapper)
    {
    }
}
