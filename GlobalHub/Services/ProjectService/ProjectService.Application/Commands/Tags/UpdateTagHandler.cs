namespace ProjectService.Application.Commands.Tags;

public record UpdateTagRequest(long Id) : BaseTagRequest, IRequest<TagDto>;

/// <inheritdoc />
public class UpdateTagHandler : IRequestHandler<UpdateTagRequest, TagDto>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService<Tag> _tagAuthService;
    private readonly IUserService _userService;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateTagHandler"/> class.
    /// </summary>
    /// <param name="dbContext">Db context.</param>
    /// <param name="mapper">Mapper.</param>
    public UpdateTagHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IAuthorizationService<Tag> tagAuthService,
        IUserService userService)
    {
        this._dbContext = dbContext;
        this._mapper = mapper;
        this._tagAuthService = tagAuthService;
        this._userService = userService;
    }

    /// <inheritdoc/>
    public async Task<TagDto> Handle(UpdateTagRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized = await this._tagAuthService.AuthorizeDelete(this._userService.UserId, request.Id);

        if (!isAuthorized)
        {
            throw new UnauthorizedAccessException();
        }

        var tagToUpdate =
            await this._dbContext.Tags.SingleOrDefaultAsync(tag => tag.Id == request.Id, cancellationToken);
        var updatedTag = this._mapper.Map(request, tagToUpdate);
        var tag = this._dbContext.Tags.Update(updatedTag).Entity;
        await this._dbContext.SaveChangesAsync(cancellationToken);

        return this._mapper.Map<TagDto>(tag);
    }
}
