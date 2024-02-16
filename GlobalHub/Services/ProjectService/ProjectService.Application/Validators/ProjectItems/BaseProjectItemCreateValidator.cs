namespace ProjectService.Application.Validators.ProjectItems;

public abstract class BaseProjectItemCreateValidator<TValidated> : AbstractValidator<TValidated>
    where TValidated : BaseProjectItemCreateRequest
{
    private readonly ApplicationDbContext _dbContext;

    protected BaseProjectItemCreateValidator(ApplicationDbContext dbContext)
    {
        this._dbContext = dbContext;

        this.RuleFor(request => request.Title).NotEmpty();
        this.RuleFor(request => request.ItemPriority).IsInEnum();
        this.RuleFor(request => request.ProjectId).NotEmpty();
        this.RuleFor(request => request).Custom((request, ctx) =>
        {
            var tagsBelongToProject = this.AreTagsBelongToProject(request.ProjectId, request.TagIds);

            if (!tagsBelongToProject)
            {
                ctx.AddFailure("Tags must belong to project item's project");
            }
        });
    }

    private bool AreTagsBelongToProject(long projectId, IEnumerable<long> tagIds)
    {
        var projectTagIds = this._dbContext.Tags
            .AsNoTracking()
            .Where(tag => tag.ProjectId == projectId)
            .Select(p => p.Id);

        return tagIds.All(tagId => projectTagIds.Contains(tagId));
    }
}
