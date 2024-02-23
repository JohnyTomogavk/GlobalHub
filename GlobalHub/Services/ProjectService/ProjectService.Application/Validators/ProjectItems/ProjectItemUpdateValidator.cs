namespace ProjectService.Application.Validators.ProjectItems;

public class ProjectItemUpdateValidator : AbstractValidator<ProjectItemUpdateRequest>
{
    private readonly ApplicationDbContext _dbContext;
    private ProjectItem? _projectItem;

    public ProjectItemUpdateValidator(ApplicationDbContext dbContext)
    {
        this._dbContext = dbContext;

        this.RuleFor(request => request.Id).NotEmpty();
        this.RuleFor(request => request.Title).NotEmpty();
        this.RuleFor(request => request.ItemPriority).IsInEnum();
        this.RuleFor(request => request.ItemType).IsInEnum().NotEqual(EProjectItemType.Unknown);
        this.RuleFor(request => request).Custom((request, ctx) =>
        {
            var tagsBelongToProject = this.AreTagsBelongToProject(request.TagIds);

            if (!tagsBelongToProject)
            {
                ctx.AddFailure("Tags must belong to project item's project");
            }
        });
        this.ValidateDataRange();
        this.When(request => request.ItemType == EProjectItemType.Task, () =>
        {
            this.RuleFor(request => request.ParentProjectItemId).GreaterThan(0);
            this.RuleFor(request => request.TaskStatus).NotEqual(ETaskStatus.Unknown).IsInEnum();
            this.EnsureParentProjectItemIsInTheSameProject();
        });
        this.When(request => request.ItemType == EProjectItemType.Event, () =>
        {
            this.RuleFor(request => request.StartDate).NotEmpty();
            this.RuleFor(request => request.DueDate).NotEmpty();
        });
    }

    protected override bool PreValidate(ValidationContext<ProjectItemUpdateRequest> context, ValidationResult result)
    {
        var loadedProjectItem = this.LoadProjectItem(context.InstanceToValidate.Id);

        return loadedProjectItem != null && base.PreValidate(context, result);
    }

    private bool AreTagsBelongToProject(IEnumerable<long> tagIds)
    {
        var projectTagIds = this._projectItem
            .Project.Tags.Select(t => t.Id);

        return tagIds.All(tagId => projectTagIds.Contains(tagId));
    }

    private void ValidateDataRange()
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

    private void EnsureParentProjectItemIsInTheSameProject()
    {
        this.RuleFor(request => request).Custom((request, ctx) =>
        {
            if (!request.ParentProjectItemId.HasValue)
            {
                return;
            }

            var parentProjectItem =
                this._dbContext.ProjectItems.SingleOrDefault(e => e.Id == request.ParentProjectItemId.Value);

            if (parentProjectItem == null || parentProjectItem?.ProjectId != this._projectItem.ProjectId)
            {
                ctx.AddFailure("Parent project item must belong to the same project");
            }
        });
    }

    private ProjectItem? LoadProjectItem(long id)
    {
        var projectItem = this._dbContext.ProjectItems
            .Include(t => t.Project)
            .ThenInclude(t => t.Tags)
            .SingleOrDefault(t => t.Id == id);

        this._projectItem = projectItem;

        return projectItem;
    }
}
