namespace ProjectService.Application.Commands.Tags;

public record UpdateTagRequest(long Id) : BaseTagRequest, IRequest<TagDto>;

/// <inheritdoc />
public class UpdateTagHandler : IRequestHandler<UpdateTagRequest, TagDto>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateTagHandler"/> class.
    /// </summary>
    /// <param name="dbContext">Db context.</param>
    /// <param name="mapper">Mapper.</param>
    public UpdateTagHandler(ApplicationDbContext dbContext, IMapper mapper)
    {
        this._dbContext = dbContext;
        this._mapper = mapper;
    }

    /// <inheritdoc/>
    public async Task<TagDto> Handle(UpdateTagRequest request, CancellationToken cancellationToken)
    {
        // TODO: Authorize access to project

        var tagToUpdate =
            await this._dbContext.Tags.SingleOrDefaultAsync(tag => tag.Id == request.Id, cancellationToken);
        var updatedTag = this._mapper.Map(request, tagToUpdate);
        var tag = this._dbContext.Tags.Update(updatedTag).Entity;
        await this._dbContext.SaveChangesAsync(cancellationToken);

        return this._mapper.Map<TagDto>(tag);
    }
}
