namespace ProjectService.Application.Commands.Tags;

public record CreateTagRequest : BaseTagRequest, IRequest<TagDto>;

/// <summary>
/// Creates new tag in project
/// </summary>
public class CreateTagHandler : IRequestHandler<CreateTagRequest, TagDto>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService<Project> _projectAuthService;
    private readonly IUserService _userService;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateTagHandler"/> class.
    /// </summary>
    /// <param name="dbContext">Db context.</param>
    /// <param name="mapper">Automapper.</param>
    public CreateTagHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IAuthorizationService<Project> projectAuthService,
        IUserService userService)
    {
        this._dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        this._projectAuthService = projectAuthService ?? throw new ArgumentNullException(nameof(projectAuthService));
        this._userService = userService ?? throw new ArgumentNullException(nameof(userService));
    }

    /// <inheritdoc/>
    public async Task<TagDto> Handle(CreateTagRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized = await this._projectAuthService.AuthorizeUpdate(this._userService.UserId, request.ProjectId);

        if (!isAuthorized)
        {
            throw new UnauthorizedAccessException();
        }

        var tagToAdd = this._mapper.Map<Tag>(request);
        var createdTag = (await this._dbContext.Tags.AddAsync(tagToAdd, cancellationToken)).Entity;
        await this._dbContext.SaveChangesAsync(cancellationToken);

        return this._mapper.Map<TagDto>(createdTag);
    }
}
