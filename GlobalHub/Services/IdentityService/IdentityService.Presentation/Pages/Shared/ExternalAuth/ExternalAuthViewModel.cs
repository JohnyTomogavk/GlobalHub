namespace IdentityService.Presentation.Pages.Shared.ExternalAuth;

public class ExternalAuthViewModel
{
    public IEnumerable<ExternalProvider> ExternalProviders { get; set; }

    public string ReturnUrl { get; set; }
}
