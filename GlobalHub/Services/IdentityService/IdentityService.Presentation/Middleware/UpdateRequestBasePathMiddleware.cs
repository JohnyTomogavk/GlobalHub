namespace IdentityService.Presentation.Middleware;

public class UpdateRequestBasePathMiddleware
{
    private readonly RequestDelegate _next;

    public UpdateRequestBasePathMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var forwardedPath = context.Request.GetForwardedPath();

        if (forwardedPath != null)
        {
            context.Request.PathBase = new PathString(forwardedPath);
        }

        await this._next(context);
    }
}
