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
            .ForMember(dto => dto.Label, config => config.MapFrom(src => src.Title))
            .ForAllMembers(opt => opt.ExplicitExpansion());
        CreateMap<ProjectItemTag, ProjectItemTagDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());
    }
}
