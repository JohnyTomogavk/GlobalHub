using AutoMapper;
using BudgetBusinessLayer.Dto.Budget;
using BudgetsService.Business.Dto.Budget;
using BudgetsService.Business.Dto.BudgetItems;
using BudgetsService.Business.Dto.Tag;
using BudgetsService.DataAccess.Entities.Budgets;
using BudgetsService.DataAccess.Entities.Tags;

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
        CreateMap<Tag, TagDto>();
    }
}
