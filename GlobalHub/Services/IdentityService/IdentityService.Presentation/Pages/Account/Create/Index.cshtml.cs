namespace IdentityService.Presentation.Pages.Account.Create;

[SecurityHeaders]
[AllowAnonymous]
public class Index : AuthPageModelBase
{
    private readonly IIdentityServerInteractionService _interactionService;
    private readonly UserManager<ApplicationUser> _userManager;

    [BindProperty] public InputModel Input { get; set; }

    public Index(
        IIdentityServerInteractionService interactionService,
        UserManager<ApplicationUser> userManager,
        IAuthenticationSchemeProvider schemeProvider) : base(schemeProvider)
    {
        _interactionService = interactionService;
        _userManager = userManager;
    }

    public async Task<IActionResult> OnGet(string returnUrl)
    {
        ReturnUrl = returnUrl;
        await BuildExternalProvidersAsync();

        return Page();
    }

    public async Task<IActionResult> OnPost()
    {
        if (Input.Button == AuthAction.RedirectToSignIn)
        {
            return RedirectToPage("/Account/Login/Index", new { ReturnUrl, });
        }

        if (Input.Button == AuthAction.SignUp)
        {
            if (ModelState.IsValid)
            {
                return await CreateUser();
            }

            await BuildExternalProvidersAsync();

            return Page();
        }

        var context = await _interactionService.GetAuthorizationContextAsync(ReturnUrl);
        await _interactionService.DenyAuthorizationAsync(context, AuthorizationError.AccessDenied);

        return Redirect(ReturnUrl);
    }

    private async Task<IActionResult> CreateUser()
    {
        var user = await _userManager.FindByNameAsync(Input.Username);

        if (user != null)
        {
            ModelState.AddModelError("Input.Username", "UserName is busy");
            await BuildExternalProvidersAsync();

            return Page();
        }

        var userToCreate = new ApplicationUser { UserName = Input.Username, Email = Input.Email };
        var identityResult = await _userManager.CreateAsync(userToCreate, Input.Password);

        if (!identityResult.Succeeded)
        {
            return await OnUserCreationFail(identityResult.Errors);
        }

        return await OnUserCreationSuccess(userToCreate);
    }

    private async Task<IActionResult> OnUserCreationFail(IEnumerable<IdentityError> identityResultErrors)
    {
        foreach (var error in identityResultErrors)
        {
            ModelState.AddModelError(error.Code, error.Description);
        }

        await BuildExternalProvidersAsync();

        return Page();
    }

    private async Task<IActionResult> OnUserCreationSuccess(ApplicationUser user)
    {
        var issuedUser = new IdentityServerUser(user.Id) { DisplayName = user.UserName };
        await HttpContext.SignInAsync(issuedUser);

        return TryGetRedirectionToReturnUrl();
    }
}
