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
    }
}
