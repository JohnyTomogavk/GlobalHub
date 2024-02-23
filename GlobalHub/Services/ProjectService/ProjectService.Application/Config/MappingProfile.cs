namespace ProjectService.Application.Config;

/// <inheritdoc />
public class MappingProfile : Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="MappingProfile"/> class.
    /// </summary>
    public MappingProfile()
    {
        this.CreateMap<Project, ProjectDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());

        this.CreateMap<ProjectItem, ProjectItemDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());

        this.CreateMap<Tag, TagDto>()
            .ForMember(
                dto => dto.Label,
                config => config.MapFrom(src => src.Title))
            .ForAllMembers(opt => opt.ExplicitExpansion());

        this.CreateMap<ProjectItemTag, ProjectItemTagDto>()
            .ForAllMembers(opt => opt.ExplicitExpansion());

        this.CreateMap<CreateTagRequest, Tag>()
            .ForMember(
                dst => dst.Title,
                cfg => cfg.MapFrom(src => src.Label));

        this.CreateMap<UpdateTagRequest, Tag>()
            .ForMember(
                dst => dst.Title,
                cfg => cfg.MapFrom(src => src.Label));

        this.CreateMap<CreateTaskRequest, ProjectItem>();

        this.CreateMap<CreateEventRequest, ProjectItem>();

        this.CreateMap<ProjectItemUpdateRequest, ProjectItem>();
    }
}
