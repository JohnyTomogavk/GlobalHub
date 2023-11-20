namespace IdentityService.Presentation.Pages.Redirect;

[AllowAnonymous]
public class IndexModel : PageModel
{
    public string RedirectUri { get; set; }

    public IActionResult OnGet(string redirectUri)
    {
        if (!Url.IsLocalUrl(redirectUri))
        {
            return RedirectToPage("/Home/Error/Index");
        }

        RedirectUri = redirectUri;
        return Page();
    }
}
