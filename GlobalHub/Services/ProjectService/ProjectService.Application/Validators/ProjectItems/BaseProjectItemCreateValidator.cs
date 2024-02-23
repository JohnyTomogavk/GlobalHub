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
        this.ValidateDateRange();
    }

    private bool AreTagsBelongToProject(long projectId, IEnumerable<long> tagIds)
    {
        var projectTagIds = this._dbContext.Tags
            .AsNoTracking()
            .Where(tag => tag.ProjectId == projectId)
            .Select(p => p.Id);

        return tagIds.All(tagId => projectTagIds.Contains(tagId));
    }

    private void ValidateDateRange()
    {
        this.RuleFor(request => request).Custom((request, ctx) =>
        {
            if ((request.StartDate.HasValue && request.DueDate.HasValue) &&
                request.StartDate.Value >= request.DueDate.Value)
            {
                ctx.AddFailure("Start date can't be after due date");
            }
        });
    }
}
