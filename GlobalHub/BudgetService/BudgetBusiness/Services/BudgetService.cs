using System.ComponentModel.DataAnnotations;
using System.Net;
using AutoMapper;
using BudgetBusinessLayer.Dto.Budget;
using BudgetBusinessLayer.Services.Interfaces;
using BudgetDataLayer.Entities.Budget;
using BudgetDataLayer.Repository.Interfaces;
using FluentValidation;

namespace BudgetBusinessLayer.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<Budget> _budgetValidator;

    public BudgetService(IBudgetRepository budgetRepository, IMapper mapper, IValidator<Budget> budgetValidator)
    {
        _budgetRepository = budgetRepository;
        _mapper = mapper;
        _budgetValidator = budgetValidator;
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

    public async Task<BudgetDto> AddBudgetAsync(CreateBudgetDto createBudgetDto)
    {
        var newBudget = _mapper.Map<Budget>(createBudgetDto);
        var validationResult = await _budgetValidator.ValidateAsync(newBudget);

        if (!validationResult.IsValid)
        {
            throw new InvalidOperationException("Budget isn't valid");
        }

        var createdEntity = await _budgetRepository.AddBudget(newBudget);
        var budgetDto = _mapper.Map<BudgetDto>(createdEntity);

        return budgetDto;
    }
}
