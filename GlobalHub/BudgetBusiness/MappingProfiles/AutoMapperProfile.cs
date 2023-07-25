﻿using AutoMapper;
using BudgetBusinessLayer.Dto.Budget;
using BudgetBusinessLayer.Dto.BudgetItem;
using BudgetDataLayer.Entities.Budget;

namespace BudgetBusinessLayer.MappingProfiles;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Budget, BudgetMap>();
        CreateMap<Budget, BudgetDto>();
        CreateMap<BudgetItem, BudgetItemDto>();
    }
}
