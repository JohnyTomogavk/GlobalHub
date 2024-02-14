namespace ProjectService.Application.Commands.ProjectItems;

public record CreateTaskRequest : IRequest<ProjectItemDto>, ITransactional
{
    public long ProjectId { get; init; }

    public string Title { get; init; }

    public string? Description { get; init; }

    public EProjectItemType ItemType { get; init; }

    public ETaskStatus TaskStatus { get; init; }

    public EPriority ItemPriority { get; init; }

    public DateTime? StartDate { get; init; }

    public DateTime? DueDate { get; init; }

    public ICollection<long> TagIds { get; init; }

    public long? ParentProjectItemId { get; init; }
}

public class CreateTaskHandler : IRequestHandler<CreateTaskRequest, ProjectItemDto>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IValidator<CreateTaskRequest> _createTaskRequestValidator;
    private readonly IMapper _mapper;

    public CreateTaskHandler(
        ApplicationDbContext dbContext,
        IValidator<CreateTaskRequest> createTaskRequestValidator,
        IMapper mapper)
    {
        this._dbContext = dbContext;
        this._createTaskRequestValidator = createTaskRequestValidator;
        this._mapper = mapper;
    }

    public async Task<ProjectItemDto> Handle(CreateTaskRequest createTaskRequest, CancellationToken cancellationToken)
    {
        // TODO: Authorize project item creation
        var validationResult =
            await this._createTaskRequestValidator.ValidateAsync(createTaskRequest, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var projectItemToCreate = this._mapper.Map<ProjectItem>(createTaskRequest);
        await this._dbContext.ProjectItems.AddAsync(projectItemToCreate, cancellationToken);
        await this._dbContext.SaveChangesAsync(cancellationToken);
        await this.AssignTagsToProjectItem(projectItemToCreate.Id, createTaskRequest.TagIds, cancellationToken);

        return this._mapper.Map<ProjectItemDto>(projectItemToCreate);
    }

    private async Task AssignTagsToProjectItem(
        long projectItemIdId,
        IEnumerable<long> tagIds,
        CancellationToken cancellationToken)
    {
        var projectTags = tagIds.Select(tagId => new ProjectItemTag
        {
            ProjectItemId = projectItemIdId, TagId = tagId,
        });

        await this._dbContext.ProjectItemTags.AddRangeAsync(projectTags, cancellationToken);
        await this._dbContext.SaveChangesAsync(cancellationToken);
    }
}
