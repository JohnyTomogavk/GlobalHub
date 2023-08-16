using AutoMapper;
using BudgetBusinessLayer.Dto.Budget;
using BudgetsService.Business.Dto.Budget;
using BudgetsService.Business.Services.Interfaces;
using BudgetsService.DataAccess.Entities.Budget;
using BudgetsService.DataAccess.Repository.Interfaces;
using BudgetsService.Infrastructure.Services.Interfaces;
using FluentValidation;

namespace BudgetsService.Business.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IBudgetItemRepository _budgetItemRepository;
    private readonly IDateTimeService _dateTimeService;
    private readonly IMapper _mapper;
    private readonly IValidator<Budget> _budgetValidator;

    public BudgetService(
        IBudgetRepository budgetRepository,
        IBudgetItemRepository budgetItemRepository,
        IDateTimeService dateTimeService,
        IMapper mapper,
        IValidator<Budget> budgetValidator)
    {
        _budgetRepository = budgetRepository;
        _budgetItemRepository = budgetItemRepository;
        _dateTimeService = dateTimeService;
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
        var budget = await _budgetRepository.GetBudgetByIdWithIncludeAsync(budgetId);
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

    public async Task<BudgetAnalyticDto> GetBudgetAnalytic(long budgetId, DateTime requestedDate)
    {
        var currentDatePeriod = _dateTimeService.GetDateTimeRangeByDate(requestedDate);
        // var budgetItems = await _budgetItemRepository.GetBudgetItemsByIdAndPeriod(budgetId, currentDatePeriod);

        var budgetAnalytic = new BudgetAnalyticDto { };

        return budgetAnalytic;
    }
}
