namespace ProjectService.Application.Config;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Project, ProjectDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());
        CreateMap<ProjectItem, ProjectItemDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());
        CreateMap<Tag, TagDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());
        CreateMap<ProjectItemTag, ProjectItemTagDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());
    }
}
