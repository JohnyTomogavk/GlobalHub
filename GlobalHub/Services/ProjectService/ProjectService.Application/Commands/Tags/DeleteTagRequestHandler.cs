namespace ProjectService.Application.Commands.Tags;

public record DeleteTagRequest(long TagId) : IRequest<long>;

/// <inheritdoc />
public class DeleteTagRequestHandler : IRequestHandler<DeleteTagRequest, long>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IAuthorizationService<Tag> _tagAuthService;
    private readonly IUserService _userService;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteTagRequestHandler"/> class.
    /// </summary>
    /// <param name="dbContext">Db context.</param>
    public DeleteTagRequestHandler(
        ApplicationDbContext dbContext,
        IAuthorizationService<Tag> tagAuthService,
        IUserService userService)
    {
        this._dbContext = dbContext;
        this._tagAuthService = tagAuthService;
        this._userService = userService;
    }

    /// <inheritdoc/>
    public async Task<long> Handle(DeleteTagRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized = await this._tagAuthService.AuthorizeDelete(this._userService.UserId, request.TagId);

        if (!isAuthorized)
        {
            throw new AccessDeniedException();
        }

        var tagToDelete = await this._dbContext.Tags.SingleOrDefaultAsync(
            tag => tag.Id == request.TagId,
            cancellationToken: cancellationToken);
        var deletedTagId = this._dbContext.Tags.Remove(tagToDelete).Entity.Id;
        await this._dbContext.SaveChangesAsync(cancellationToken);

        return deletedTagId;
    }
}
