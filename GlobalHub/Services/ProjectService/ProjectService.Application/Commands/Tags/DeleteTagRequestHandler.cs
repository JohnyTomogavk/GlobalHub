namespace ProjectService.Application.Commands.Tags;

public record DeleteTagRequest(long TagId) : IRequest<long>;

/// <inheritdoc />
public class DeleteTagRequestHandler : IRequestHandler<DeleteTagRequest, long>
{
    private readonly ApplicationDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteTagRequestHandler"/> class.
    /// </summary>
    /// <param name="dbContext">Db context.</param>
    public DeleteTagRequestHandler(ApplicationDbContext dbContext)
    {
        this._dbContext = dbContext;
    }

    /// <inheritdoc/>
    public async Task<long> Handle(DeleteTagRequest request, CancellationToken cancellationToken)
    {
        // TODO: Authorize access to project
        var tagToDelete = await this._dbContext.Tags.SingleOrDefaultAsync(
            tag => tag.Id == request.TagId,
            cancellationToken: cancellationToken);
        var deletedTagId = this._dbContext.Tags.Remove(tagToDelete).Entity.Id;
        await this._dbContext.SaveChangesAsync(cancellationToken);

        return deletedTagId;
    }
}
