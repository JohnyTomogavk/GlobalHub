namespace ProjectService.Application.Validators.ProjectItems;

public class CreateEventRequestValidator : BaseProjectItemCreateValidator<CreateEventRequest>
{
    public CreateEventRequestValidator(ApplicationDbContext dbContext)
        : base(dbContext)
    {
        this.RuleFor(request => request.ItemType).Equal(EProjectItemType.Event);
        this.RuleFor(request => request.StartDate).NotEmpty();
        this.RuleFor(request => request.DueDate).NotEmpty();
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
