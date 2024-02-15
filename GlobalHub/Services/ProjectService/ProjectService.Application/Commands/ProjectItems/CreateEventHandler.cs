namespace ProjectService.Application.Commands.ProjectItems;

public record CreateEventRequest : BaseProjectItemCreateRequest, ITransactional;

public class CreateEventHandler : BaseProjectItemRequestHandler<CreateEventRequest, ProjectItemDto>
{
    public CreateEventHandler(
        ApplicationDbContext dbContext,
        IValidator<CreateEventRequest> validator,
        IMapper mapper)
        : base(dbContext, validator, mapper)
    {
    }
}
