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
        IMapper mapper)
        : base(dbContext, mapper)
    {
    }
}
