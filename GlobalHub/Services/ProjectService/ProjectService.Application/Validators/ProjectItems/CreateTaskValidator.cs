namespace ProjectService.Application.Validators.ProjectItems;

public class CreateTaskValidator : AbstractValidator<CreateTaskRequest>
{
    private readonly ApplicationDbContext _dbContext;

    public CreateTaskValidator(ApplicationDbContext dbContext)
    {
        this._dbContext = dbContext;

        this.RuleFor(request => request.Title).NotEmpty();
        this.RuleFor(request => request.ItemType).Equal(EProjectItemType.Task);
        this.RuleFor(request => request.TaskStatus).NotEqual(ETaskStatus.Unknown);
        this.RuleFor(request => request.TaskStatus).IsInEnum();
        this.RuleFor(request => request.ItemPriority).IsInEnum();
        this.RuleFor(request => request.ParentProjectItemId).GreaterThan(0);
        this.RuleFor(request => request.ProjectId).NotEmpty();
        this.RuleFor(request => request).Custom((request, ctx) =>
        {
            var tagsBelongToProject = this.AreTagsTagsBelongToProject(request.ProjectId, request.TagIds);

            if (!tagsBelongToProject)
            {
                ctx.AddFailure("Tags must belong to project item's project");
            }
        });
    }

    private bool AreTagsTagsBelongToProject(long projectId, IEnumerable<long> tagIds)
    {
        var projectTagIds = this._dbContext.Tags
            .AsNoTracking()
            .Where(tag => tag.ProjectId == projectId)
            .Select(p => p.Id);

        return tagIds.All(tagId => projectTagIds.Contains(tagId));
    }
}
