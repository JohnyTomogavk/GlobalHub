using AutoMapper;
using BudgetBusinessLayer.Dto.Budget;
using BudgetDataLayer.Entities.Budget;

namespace BudgetBusinessLayer.MappingProfiles;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Budget, BudgetMap>();
    }
}
