namespace ProjectService.Presentation.Controllers;

[ApiController]
[Route("api/v1/[controller]/[action]")]
public class ProjectsController : BaseController<Project>
{
    public ProjectsController(IBaseService<Project> baseService) : base(baseService)
    {
    }
}
