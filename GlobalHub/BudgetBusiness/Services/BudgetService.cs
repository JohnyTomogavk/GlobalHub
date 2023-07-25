using System.Net;
using AutoMapper;
using BudgetBusinessLayer.Dto.Budget;
using BudgetBusinessLayer.Services.Interfaces;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.Repository.Interfaces;

namespace BudgetBusinessLayer.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IMapper _mapper;

    public BudgetService(IBudgetRepository budgetRepository, IMapper mapper)
    {
        _budgetRepository = budgetRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync()
    {
        var userBudgets = await _budgetRepository.GetUserBudgetsAsync();
        var maps = _mapper.Map<IEnumerable<BudgetMap>>(userBudgets);

        return maps;
    }

    public async Task<BudgetDto> GetBudgetByIdAsync(long budgetId)
    {
        var budget = await _budgetRepository.GetBudgetByIdAsync(budgetId);
        var mappedBudget = _mapper.Map<BudgetDto>(budget);

        return mappedBudget;
    }
}
