namespace IdentityService.Infrastructure.Services;

public class AppProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _claimsPrincipalFactory;

    public AppProfileService(UserManager<ApplicationUser> userManager,
        IUserClaimsPrincipalFactory<ApplicationUser> claimsPrincipalFactory)
    {
        _userManager = userManager;
        _claimsPrincipalFactory = claimsPrincipalFactory;
    }

    /// <summary>
    /// Use this method to add additional claims to a tokens
    /// </summary>
    /// <param name="context"></param>
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var subjectId = context.Subject.GetSubjectId();
        var user = await _userManager.FindByIdAsync(subjectId);

        var claimsPrincipal = await _claimsPrincipalFactory.CreateAsync(user);
        var claims = claimsPrincipal.Claims.ToList();

        context.IssuedClaims.AddRange(claims);
    }

    public async Task IsActiveAsync(IsActiveContext context)
    {
        var subjectId = context.Subject.GetSubjectId();
        var user = await _userManager.FindByIdAsync(subjectId);

        context.IsActive = user != null;
    }
}
