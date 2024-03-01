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

        this.CreateMap<ProjectItem, BeforeTaskDueDatedIsReachedNotificationMessage>()
            .ForMember(
                dst => dst.ProjectItemTitle,
                cfg => cfg.MapFrom(src => src.Title))
            .ForMember(
                dst => dst.ProjectTitle,
                cfg => cfg.MapFrom(src => src.Project.Title))
            .ForMember(
                dst => dst.ProjectId,
                cfg => cfg.MapFrom(src => src.ProjectId))
            .ForMember(
                dst => dst.ProjectItemId,
                cfg => cfg.MapFrom(src => src.Id))
            .ForMember(
                dst => dst.DueDate,
                cfg => cfg.MapFrom(src => src.DueDate))
            .ForMember(
                dst => dst.RecipientId,
                cfg => cfg.MapFrom(src => src.CreatedBy));

        this.CreateMap<ProjectItem, BeforeEventStartedNotificationMessage>()
            .ForMember(
                dst => dst.ProjectItemTitle,
                cfg => cfg.MapFrom(src => src.Title))
            .ForMember(
                dst => dst.ProjectTitle,
                cfg => cfg.MapFrom(src => src.Project.Title))
            .ForMember(
                dst => dst.ProjectId,
                cfg => cfg.MapFrom(src => src.ProjectId))
            .ForMember(
                dst => dst.ProjectItemId,
                cfg => cfg.MapFrom(src => src.Id))
            .ForMember(
                dst => dst.EventStartDate,
                cfg => cfg.MapFrom(src => src.StartDate))
            .ForMember(
                dst => dst.RecipientId,
                cfg => cfg.MapFrom(src => src.CreatedBy));

        this.CreateMap<ProjectItem, OnEventStartedNotificationMessage>()
            .ForMember(
                dst => dst.ProjectItemTitle,
                cfg => cfg.MapFrom(src => src.Title))
            .ForMember(
                dst => dst.ProjectTitle,
                cfg => cfg.MapFrom(src => src.Project.Title))
            .ForMember(
                dst => dst.ProjectId,
                cfg => cfg.MapFrom(src => src.ProjectId))
            .ForMember(
                dst => dst.ProjectItemId,
                cfg => cfg.MapFrom(src => src.Id))
            .ForMember(
                dst => dst.EventStartDate,
                cfg => cfg.MapFrom(src => src.StartDate))
            .ForMember(
                dst => dst.RecipientId,
                cfg => cfg.MapFrom(src => src.CreatedBy));
    }
}
