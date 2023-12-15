namespace IdentityService.Infrastructure.Models;

public enum AuthAction
{
    Cancel = 0,
    SignIn = 1,
    RedirectToSignUp = 2,
    SignUp = 3,
    RedirectToSignIn = 4,
}
