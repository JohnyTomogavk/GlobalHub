namespace NotificationService.API.Configs;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        this.CreateMap<BeforeTaskDueDatedIsReachedNotificationMessage, BeforeTaskDueDateNotification>()
            .ForMember(
                dst => dst.DateReceived,
                cfg => cfg.MapFrom(src => DateTime.Now))
            .ForMember(
                dst => dst.EventType,
                cfg => cfg.MapFrom(src => EEventType.BeforeTaskDueDate));

        this.CreateMap<BeforeEventStartedNotificationMessage, BeforeEventStartedNotification>()
            .ForMember(
                dst => dst.DateReceived,
                cfg => cfg.MapFrom(src => DateTime.Now))
            .ForMember(
                dst => dst.EventType,
                cfg => cfg.MapFrom(src => EEventType.BeforeEventStarted));

        this.CreateMap<OnEventStartedNotificationMessage, OnEventStartedNotification>()
            .ForMember(
                dst => dst.DateReceived,
                cfg => cfg.MapFrom(src => DateTime.Now))
            .ForMember(
                dst => dst.EventType,
                cfg => cfg.MapFrom(src => EEventType.OnEventStarted));
    }
}
