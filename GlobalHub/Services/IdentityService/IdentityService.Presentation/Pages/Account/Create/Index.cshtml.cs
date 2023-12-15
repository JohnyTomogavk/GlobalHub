namespace IdentityService.Presentation.Pages.Account.Create;

[SecurityHeaders]
[AllowAnonymous]
public class Index : PageModel
{
    private readonly IIdentityServerInteractionService _interaction;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IAuthenticationSchemeProvider _schemeProvider;

    [BindProperty] public InputModel Input { get; set; }

    // TODO: Extract to base
    public IEnumerable<ExternalProvider> ExternalProviders { get; set; }

    public Index(
        IIdentityServerInteractionService interaction,
        UserManager<ApplicationUser> userManager, IAuthenticationSchemeProvider schemeProvider)
    {
        _interaction = interaction;
        _userManager = userManager;
        _schemeProvider = schemeProvider;
    }

    public async Task<IActionResult> OnGet(string returnUrl)
    {
        await BuildModelAsync(returnUrl);

        return Page();
    }

    public async Task<IActionResult> OnPost()
    {
        // check if we are in the context of an authorization request
        var context = await _interaction.GetAuthorizationContextAsync(Input.ReturnUrl);

        if (Input.Button == AuthAction.RedirectToSignIn)
        {
            return RedirectToPage("/Account/Login/Index", new { Input.ReturnUrl, });
        }

        // the user clicked the "cancel" button
        if (Input.Button != AuthAction.SignUp)
        {
            if (context != null)
            {
                // if the user cancels, send a result back into IdentityServer as if they 
                // denied the consent (even if this client does not require consent).
                // this will send back an access denied OIDC error response to the client.
                await _interaction.DenyAuthorizationAsync(context, AuthorizationError.AccessDenied);

                // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                if (context.IsNativeClient())
                {
                    // The client is native, so this change in how to
                    // return the response is for better UX for the end user.
                    return this.LoadingPage(Input.ReturnUrl);
                }

                return Redirect(Input.ReturnUrl);
            }
            else
            {
                // since we don't have a valid context, then we just go back to the home page
                return Redirect("~/");
            }
        }

        if (await _userManager.FindByNameAsync(Input.Username) != null)
        {
            ModelState.AddModelError("Input.Username", "UserName is busy");
        }

        if (ModelState.IsValid)
        {
            var user = new ApplicationUser() { UserName = Input.Username, Email = Input.Email };
            var identityResult = await _userManager.CreateAsync(user, Input.Password);

            if (!identityResult.Succeeded)
            {
                ModelState.AddModelError("error", "Error сreating user");

                return Page();
            }

            // issue authentication cookie with subject ID and username
            var isuser = new IdentityServerUser(user.Id) { DisplayName = user.UserName };

            await HttpContext.SignInAsync(isuser);

            if (context != null)
            {
                if (context.IsNativeClient())
                {
                    // The client is native, so this change in how to
                    // return the response is for better UX for the end user.
                    return this.LoadingPage(Input.ReturnUrl);
                }

                // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                return Redirect(Input.ReturnUrl);
            }

            // TODO: Extract to base
            // request for a local page
            if (Url.IsLocalUrl(Input.ReturnUrl))
            {
                return Redirect(Input.ReturnUrl);
            }
            else if (string.IsNullOrEmpty(Input.ReturnUrl))
            {
                return Redirect("~/");
            }
            else
            {
                // user might have clicked on a malicious link - should be logged
                throw new Exception("invalid return URL");
            }
        }

        return Page();
    }

    // TODO: Extract to base
    private async Task BuildModelAsync(string returnUrl)
    {
        Input = new InputModel { ReturnUrl = returnUrl };
        var schemes = await _schemeProvider.GetAllSchemesAsync();

        var providers = schemes
            .Where(x => x.DisplayName != null)
            .Select(x => new ExternalProvider { DisplayName = x.DisplayName ?? x.Name, AuthenticationScheme = x.Name })
            .ToList();

        ExternalProviders = providers.ToArray();
    }
}
