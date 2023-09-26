using ValidationException = System.ComponentModel.DataAnnotations.ValidationException;

namespace BudgetsService.Business.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<Budget> _budgetValidator;
    private readonly IValidator<UpdateBudgetPreservePercentDto> _preservePercentDto;

    public BudgetService(
        IBudgetRepository budgetRepository,
        IMapper mapper,
        IValidator<Budget> budgetValidator,
        IValidator<UpdateBudgetPreservePercentDto> preservePercentDto)
    {
        _budgetRepository = budgetRepository;
        _mapper = mapper;
        _budgetValidator = budgetValidator;
        _preservePercentDto = preservePercentDto;
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

    public async Task<BudgetAnalyticDto> GetBudgetAnalytic(long budgetId, DateTimeRange dateRange)
    {
        var budget = await _budgetRepository.GetBudgetByIdWithIncludeAsync(budgetId, budget => budget.BudgetItems);
        var analyticDto = GetBudgetAnalytic(budget);

        return analyticDto;
    }

    public async Task<Budget> DeleteBudgetById(long id)
    {
        return await _budgetRepository.DeleteById(id);
    }

    public async Task UpdateBudgetTitle(long budgetId, string title)
    {
        await _budgetRepository.UpdateBudgetTitle(budgetId, title);
    }

    public async Task UpdateBudgetDescription(long budgetId, string description)
    {
        await _budgetRepository.UpdateBudgetDescription(budgetId, description);
    }

    public async Task<Budget> UpdatePreservePercent(long budgetId, UpdateBudgetPreservePercentDto dto)
    {
        var validationResult = await this._preservePercentDto.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            throw new ValidationException("Budget Preserve Percent is not valid");
        }

        var budget = await _budgetRepository.GetBudgetByIdWithIncludeAsync(budgetId);

        if (budget == null)
        {
            throw new InvalidOperationException("Budget is not found");
        }

        budget.PreserveFromIncomingPercent = dto.PreservePercent;
        return await _budgetRepository.UpdateBudget(budget);
    }

    private BudgetAnalyticDto GetBudgetAnalytic(Budget budget)
    {
        // TODO: Current month filter
        decimal moneyPreserved = budget.BudgetItems
            .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
            .Sum(item => item.OperationCost) * budget.PreserveFromIncomingPercent / 100;

        var analyticDto = new BudgetAnalyticDto
        {
            // TODO: Current month filter
            IrregularExpenses = budget.BudgetItems
                .Where(item =>
                    item is
                    {
                        BudgetItemRegularityType: BudgetItemRegularityType.Irregular,
                        BudgetItemOperationType: BudgetItemOperationType.Outgoing
                    })
                .Sum(item => item.OperationCost),
            // TODO: Current month filter
            RegularExpenses = budget.BudgetItems
                .Where(item =>
                    item is
                    {
                        BudgetItemRegularityType: BudgetItemRegularityType.Regular,
                        BudgetItemOperationType: BudgetItemOperationType.Outgoing
                    })
                .Sum(item => item.OperationCost),
            MoneyPreserved = moneyPreserved,
            MoneyLeft = budget.BudgetItems
                            .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
                            .Sum(item => item.OperationCost) -
                        budget.BudgetItems
                            .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                            .Sum(item => item.OperationCost) - moneyPreserved,
            AverageDailyExpenses = GetAverageDailyExpenses(budget),
            ExpensesMedian = budget.BudgetItems
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                .Select(item => item.OperationCost).ToArray().GetMedianValue(),
        };

        return analyticDto;
    }

    private static decimal GetAverageDailyExpenses(Budget budget)
    {
        decimal avgDailyExpenses = 0;

        // TODO: Current month filter
        if (budget.BudgetItems.Any(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing))
        {
            avgDailyExpenses = budget.BudgetItems
                .GroupBy(item => item.OperationDate.Date)
                .Average(dailyExpenses =>
                    dailyExpenses.Average(dailySpentItem => dailySpentItem.OperationCost));
        }

        return avgDailyExpenses;
    }
}
