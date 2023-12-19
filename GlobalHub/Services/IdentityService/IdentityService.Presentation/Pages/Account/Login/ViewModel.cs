namespace IdentityService.Presentation.Pages.Account.Login;

public class ViewModel
{
    public IEnumerable<ExternalProvider> ExternalProviders { get; set; } =
        Enumerable.Empty<ExternalProvider>();
}
