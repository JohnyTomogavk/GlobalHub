namespace ProjectService.Application.Validators.ProjectItems;

public class CreateTaskRequestValidator : BaseProjectItemCreateValidator<CreateTaskRequest>
{
    private readonly ApplicationDbContext _dbContext;

    public CreateTaskRequestValidator(ApplicationDbContext dbContext)
        : base(dbContext)
    {
        this._dbContext = dbContext;

        this.RuleFor(request => request.ItemType).Equal(EProjectItemType.Task);
        this.RuleFor(request => request.ParentProjectItemId).GreaterThan(0);
        this.RuleFor(request => request.TaskStatus).NotEqual(ETaskStatus.Unknown);
        this.RuleFor(request => request.TaskStatus).IsInEnum();
        this.EnsureParentProjectItemIsInTheSameProject();
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

            if (parentProjectItem == null || parentProjectItem?.ProjectId != request.ProjectId)
            {
                ctx.AddFailure("Parent project item must belong to the same project");
            }
        });
    }
}
