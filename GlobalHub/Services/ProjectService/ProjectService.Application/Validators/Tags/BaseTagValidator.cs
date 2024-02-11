namespace ProjectService.Application.Validators.Tags;

/// <inheritdoc />
public abstract class BaseTagValidator<T> : AbstractValidator<T>
    where T : BaseTagRequest
{
    /// <summary>
    /// Initializes a new instance of the <see cref="BaseTagValidator{T}"/> class.
    /// </summary>
    protected BaseTagValidator()
    {
        this.RuleFor(request => request.Color).IsInEnum();
        this.RuleFor(request => request.Label).NotEmpty();
        this.RuleFor(request => request.ProjectId).NotEmpty();
    }
}
