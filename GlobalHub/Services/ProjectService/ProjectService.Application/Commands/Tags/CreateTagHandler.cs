namespace ProjectService.Application.Commands.Tags;

public record CreateTagRequest : BaseTagRequest, IRequest<TagDto>;

/// <summary>
/// Creates new tag in project
/// </summary>
public class CreateTagHandler : IRequestHandler<CreateTagRequest, TagDto>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateTagRequest> _createTagDtoValidator;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateTagHandler"/> class.
    /// </summary>
    /// <param name="dbContext">Db context.</param>
    /// <param name="mapper">Automapper.</param>
    /// <param name="validator">Create tag dto validator.</param>
    public CreateTagHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IValidator<CreateTagRequest> validator)
    {
        this._dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        this._createTagDtoValidator = validator ?? throw new ArgumentNullException(nameof(validator));
    }

    /// <inheritdoc/>
    public async Task<TagDto> Handle(CreateTagRequest request, CancellationToken cancellationToken)
    {
        var validationResult = await this._createTagDtoValidator.ValidateAsync(request, cancellationToken);

        // TODO: Authorize access to project

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var tagToAdd = this._mapper.Map<Tag>(request);
        var createdTag = (await this._dbContext.Tags.AddAsync(tagToAdd, cancellationToken)).Entity;
        await this._dbContext.SaveChangesAsync(cancellationToken);

        return this._mapper.Map<TagDto>(createdTag);
    }
}
