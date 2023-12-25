namespace IdentityService.Infrastructure.Extensions;

public static class HttpRequestExtensions
{
    private const string XForwardedPathHeaderName = "X-Forwarded-Path";

    public static string? GetForwardedPath(this HttpRequest ctx) => ctx.Headers[XForwardedPathHeaderName];
}
