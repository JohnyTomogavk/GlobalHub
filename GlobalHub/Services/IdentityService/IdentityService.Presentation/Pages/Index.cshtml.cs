using System.Reflection;

namespace IdentityService.Presentation.Pages.Home;

[AllowAnonymous]
public class Index : PageModel
{
    public string Version;

    public void OnGet()
    {
        Version = typeof(Duende.IdentityServer.Hosting.IdentityServerMiddleware).Assembly
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion.Split('+').First();
    }
}
