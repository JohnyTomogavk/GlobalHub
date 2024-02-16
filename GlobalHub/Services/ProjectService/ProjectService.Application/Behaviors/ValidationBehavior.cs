namespace ProjectService.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, IValidatable
{
    private readonly IValidator<TRequest> _requestValidator;

    public ValidationBehavior(IValidator<TRequest> requestValidator)
    {
        this._requestValidator = requestValidator ?? throw new ArgumentNullException(nameof(requestValidator));
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var validationResult = await this._requestValidator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var response = await next();

        return response;
    }
}
