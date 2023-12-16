namespace IdentityService.Presentation.Pages.Account.Base;

/// <summary>
/// Base page for Sign In and Sign Up pages
/// </summary>
[SecurityHeaders]
[AllowAnonymous]
public class AuthPageModelBase : PageModel
{
    [BindProperty] public string ReturnUrl { get; set; }

    public IEnumerable<ExternalProvider> ExternalProviders = Array.Empty<ExternalProvider>();

    protected readonly IAuthenticationSchemeProvider SchemeProvider;

    public AuthPageModelBase(IAuthenticationSchemeProvider schemeProvider)
    {
        SchemeProvider = schemeProvider;
    }

    protected async Task BuildModelAsync()
    {
        var schemes = await SchemeProvider.GetAllSchemesAsync();

        var providers = schemes
            .Where(x => x.DisplayName != null)
            .Select(x => new ExternalProvider { DisplayName = x.DisplayName ?? x.Name, AuthenticationScheme = x.Name })
            .ToList();

        ExternalProviders = providers.ToArray();
    }

    protected IActionResult TryGetRedirectionToReturnUrl()
    {
        if (Url.IsLocalUrl(ReturnUrl))
        {
            return Redirect(ReturnUrl);
        }

        if (string.IsNullOrEmpty(ReturnUrl))
        {
            return Redirect("~/");
        }

        throw new Exception("invalid return URL");
    }
}
