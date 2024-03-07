using Common.EventBus.Messages.FullTextSearchModels.Budgets;

namespace BudgetsService.Business.MappingProfiles;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Budget, BudgetMap>();
        CreateMap<Budget, BudgetDto>();
        CreateMap<BudgetItem, BudgetItemDto>().ForMember(dst => dst.TagIds,
            memberOptions =>
                memberOptions.MapFrom(src => src.BudgetItemTags.Select(budgetItemTag => budgetItemTag.TagId)));
        CreateMap<CreateBudgetDto, Budget>();
        CreateMap<Tag, TagDto>().ReverseMap();
        CreateMap<BudgetItemCreateDto, BudgetItem>();
        CreateMap<TagCreateDto, Tag>();
        CreateMap<TagLimit, TagLimitDto>().ReverseMap();

        this.CreateMap<Budget, BudgetSearchItem>()
            .ForMember(
                dst => dst.BudgetId,
                cfg => cfg.MapFrom(src => src.Id))
            .ForMember(
                dst => dst.Title,
                cfg => cfg.MapFrom(src => src.BudgetTitle))
            .ForMember(
                dst => dst.Tags,
                cfg => cfg.MapFrom(src => src.BudgetTags.Select(tag => tag.Label)))
            .ForMember(
                dst => dst.UserId,
                cfg => cfg.MapFrom(src => src.CreatedBy))
            .ForMember(
                dst => dst.EntityType,
                cfg => cfg.MapFrom(dst => EEntityType.Budget));

        this.CreateMap<BudgetItem, BudgetItemSearchItem>()
            .ForMember(
                dst => dst.BudgetItemId,
                cfg => cfg.MapFrom(src => src.Id))
            .ForMember(
                dst => dst.BudgetId,
                cfg => cfg.MapFrom(src => src.BudgetId))
            .ForMember(
                dst => dst.BudgetTitle,
                cfg => cfg.MapFrom(src => src.Budget.BudgetTitle))
            .ForMember(
                dst => dst.BudgetItemTitle,
                cfg => cfg.MapFrom(src => src.ItemTitle))
            .ForMember(
                dst => dst.Tags,
                cfg =>
                    cfg.MapFrom(src => src.BudgetItemTags.Select(itemTag => itemTag.Tag.Label)))
            .ForMember(
                dst => dst.UserId,
                cfg => cfg.MapFrom(src => src.CreatedBy))
            .ForMember(
                dst => dst.EntityType,
                cfg => cfg.MapFrom(dst => EEntityType.BudgetItem));
    }
}
