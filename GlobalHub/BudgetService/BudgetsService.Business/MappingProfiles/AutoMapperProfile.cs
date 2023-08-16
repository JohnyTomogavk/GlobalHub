using AutoMapper;
using BudgetBusinessLayer.Dto.Budget;
using BudgetsService.Business.Dto.Budget;
using BudgetsService.Business.Dto.BudgetItem;
using BudgetsService.Business.Services;
using BudgetsService.DataAccess.Entities.Budget;

namespace BudgetsService.Business.MappingProfiles;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<BudgetService, BudgetMap>();
        CreateMap<BudgetService, BudgetDto>();
        CreateMap<BudgetItem, BudgetItemDto>();
        CreateMap<CreateBudgetDto, BudgetService>();
    }
}
