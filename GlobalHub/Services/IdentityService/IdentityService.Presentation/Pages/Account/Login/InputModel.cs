namespace IdentityService.Presentation.Pages.Account.Login;

public class InputModel
{
    [Required] public string Username { get; set; }

    [Required] public string Password { get; set; }

    public bool RememberLogin { get; set; }

    public AuthAction Button { get; set; }
}
