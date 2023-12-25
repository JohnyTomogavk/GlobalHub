namespace IdentityService.Infrastructure.Extensions;

public static class HttpRequestExtensions
{
    private const string XForwardedPathHeaderName = "X-Forwarded-Path";
    private const string XForwardedHostHeaderName = "X-Forwarded-Host";
    private const string XForwardedForHeaderName = "X-Forwarded-For";
    private const string XForwardedProtoHeaderName = "X-Forwarded-Proto";

    public static string? GetForwardedPath(this HttpRequest ctx) => ctx.Headers[XForwardedPathHeaderName];

    public static string? GetForwardedHost(this HttpRequest ctx) => ctx.Headers[XForwardedHostHeaderName];

    public static string? GetForwardedFor(this HttpRequest ctx) => ctx.Headers[XForwardedForHeaderName];

    public static string? GetForwardedProto(this HttpRequest ctx) => ctx.Headers[XForwardedProtoHeaderName];
}
