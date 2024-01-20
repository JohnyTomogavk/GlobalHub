namespace ProjectService.Application.Config;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Project, ProjectDto>();
        CreateMap<ProjectItem, ProjectItemDto>();
        CreateMap<Tag, TagDto>();
        CreateMap<ProjectItemTag, ProjectItemTagDto>();
    }
}
