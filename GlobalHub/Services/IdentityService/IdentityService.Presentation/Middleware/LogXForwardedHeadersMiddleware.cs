namespace IdentityService.Presentation.Middleware;

public class LogXForwardedHeadersMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LogXForwardedHeadersMiddleware> _logger;

    public LogXForwardedHeadersMiddleware(RequestDelegate next, ILogger<LogXForwardedHeadersMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var xForwardedPath = context.Request.GetForwardedPath();
        var xForwardedHost = context.Request.GetForwardedHost();
        var xForwardedFor = context.Request.GetForwardedFor();
        var xForwardedProto = context.Request.GetForwardedProto();

        _logger.LogInformation(
            "X-Forwarded-Host: {XForwardedHost}; " +
            "X-Forwarded-Path: {XForwardedPath}; " +
            "X-Forwarded-For: {XForwardedFor}; " +
            "X-Forwarded-Proto: {XForwardedProto};",
            xForwardedHost, xForwardedPath, xForwardedFor, xForwardedProto);

        await _next(context);
    }
}
