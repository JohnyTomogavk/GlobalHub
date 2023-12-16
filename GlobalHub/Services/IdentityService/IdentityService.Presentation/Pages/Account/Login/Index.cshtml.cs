namespace IdentityService.Presentation.Pages.Account.Login;

[SecurityHeaders]
[AllowAnonymous]
public class Index : AuthPageModelBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IIdentityServerInteractionService _interactionService;
    private readonly IEventService _eventsService;

    [BindProperty] public InputModel Input { get; set; }

    public Index(
        IIdentityServerInteractionService interactionService,
        IAuthenticationSchemeProvider schemeProvider,
        IIdentityProviderStore identityProviderStore,
        IEventService eventsService,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager) : base(schemeProvider)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _interactionService = interactionService;
        _eventsService = eventsService;
    }

    public async Task<IActionResult> OnGet(string returnUrl)
    {
        ReturnUrl = returnUrl;
        await BuildModelAsync();

        return Page();
    }

    public async Task<IActionResult> OnPost()
    {
        var context = await _interactionService.GetAuthorizationContextAsync(ReturnUrl);

        if (Input.Button == AuthAction.RedirectToSignUp)
        {
            return RedirectToPage("/Account/Create/Index", new { ReturnUrl, });
        }

        if (Input.Button == AuthAction.SignIn)
        {
            if (!ModelState.IsValid)
            {
                await BuildModelAsync();

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

        return Redirect(ReturnUrl);
    }

    private async Task<IActionResult> HandleFailedLogin(AuthorizationRequest context)
    {
        await _eventsService.RaiseAsync(new UserLoginFailureEvent(Input.Username, "invalid credentials",
            clientId: context?.Client.ClientId));
        ModelState.AddModelError(string.Empty, LoginOptions.InvalidCredentialsErrorMessage);
        await BuildModelAsync();

        return Page();
    }

    private async Task<IActionResult> OnSignInSuccess(AuthorizationRequest context)
    {
        var user = await _userManager.FindByNameAsync(Input.Username);
        await _eventsService.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName,
            clientId: context?.Client.ClientId));

        return TryGetRedirectionToReturnUrl();
    }
}
