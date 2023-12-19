namespace IdentityService.Presentation.Pages.Account.Create;

public class InputModel
{
    [Required] public string Username { get; set; }

    [Required] public string Password { get; set; }

    [Required] public string Email { get; set; }

    public AuthAction Button { get; set; }
}
