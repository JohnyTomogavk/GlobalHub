namespace ProjectService.Application.Validators.ProjectItems;

public class CreateTaskRequestValidator : BaseProjectItemCreateValidator<CreateTaskRequest>
{
    public CreateTaskRequestValidator(ApplicationDbContext dbContext)
        : base(dbContext)
    {
        this.RuleFor(request => request.ItemType).Equal(EProjectItemType.Task);
        this.RuleFor(request => request.ParentProjectItemId).GreaterThan(0);
        this.RuleFor(request => request.TaskStatus).NotEqual(ETaskStatus.Unknown);
        this.RuleFor(request => request.TaskStatus).IsInEnum();
    }
}
