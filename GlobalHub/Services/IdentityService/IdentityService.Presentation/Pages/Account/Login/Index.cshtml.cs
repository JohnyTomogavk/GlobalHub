using Azure;

namespace IdentityService.Presentation.Pages.Account.Login;

[SecurityHeaders]
[AllowAnonymous]
public class Index : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IIdentityServerInteractionService _interactionService;
    private readonly IEventService _eventsService;
    private readonly IAuthenticationSchemeProvider _schemeProvider;

    public ViewModel View { get; set; }

    [BindProperty] public InputModel Input { get; set; }

    public Index(
        IIdentityServerInteractionService interactionService,
        IAuthenticationSchemeProvider schemeProvider,
        IIdentityProviderStore identityProviderStore,
        IEventService eventsService,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _interactionService = interactionService;
        _schemeProvider = schemeProvider;
        _eventsService = eventsService;
    }

    public async Task<IActionResult> OnGet(string returnUrl)
    {
        await BuildModelAsync(returnUrl);

        return Page();
    }

    public async Task<IActionResult> OnPost()
    {
        var context = await _interactionService.GetAuthorizationContextAsync(Input.ReturnUrl);

        if (Input.Button == AuthAction.Register)
        {
            return RedirectToPage("/Account/Create/Index");
        }

        if (Input.Button == AuthAction.Login)
        {
            if (!ModelState.IsValid)
            {
                await BuildModelAsync(Input.ReturnUrl);

                return Page();
            }

            var signInResult = await _signInManager.PasswordSignInAsync(Input.Username,
                Input.Password,
                Input.RememberLogin,
                lockoutOnFailure: true);

            if (signInResult.Succeeded)
            {
                return await OnSignInSuccess(context);
            }

            return await HandleFailedLogin(context);
        }

        await _interactionService.DenyAuthorizationAsync(context, AuthorizationError.AccessDenied);

        return Redirect(Input.ReturnUrl);
    }

    private async Task BuildModelAsync(string returnUrl)
    {
        Input = new InputModel { ReturnUrl = returnUrl };
        var schemes = await _schemeProvider.GetAllSchemesAsync();

        var providers = schemes
            .Where(x => x.DisplayName != null)
            .Select(x => new ExternalProvider { DisplayName = x.DisplayName ?? x.Name, AuthenticationScheme = x.Name })
            .ToList();

        View = new ViewModel { ExternalProviders = providers.ToArray() };
    }

    private async Task<IActionResult> HandleFailedLogin(AuthorizationRequest context)
    {
        await _eventsService.RaiseAsync(new UserLoginFailureEvent(Input.Username, "invalid credentials",
            clientId: context?.Client.ClientId));
        ModelState.AddModelError(string.Empty, LoginOptions.InvalidCredentialsErrorMessage);
        await BuildModelAsync(Input.ReturnUrl);

        return Page();
    }

    private async Task<IActionResult> OnSignInSuccess(AuthorizationRequest context)
    {
        var user = await _userManager.FindByNameAsync(Input.Username);
        await _eventsService.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName,
            clientId: context?.Client.ClientId));

        return TryGetRedirectionToReturnUrl();
    }

    private IActionResult TryGetRedirectionToReturnUrl()
    {
        if (Url.IsLocalUrl(Input.ReturnUrl))
        {
            return Redirect(Input.ReturnUrl);
        }

        if (string.IsNullOrEmpty(Input.ReturnUrl))
        {
            return Redirect("~/");
        }

        throw new Exception("invalid return URL");
    }
}
