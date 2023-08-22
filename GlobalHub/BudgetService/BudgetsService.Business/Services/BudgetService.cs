namespace BudgetsService.Business.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<Budget> _budgetValidator;

    public BudgetService(
        IBudgetRepository budgetRepository,
        IMapper mapper,
        IValidator<Budget> budgetValidator)
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

    private BudgetAnalyticDto GetBudgetAnalytic(Budget budget)
    {
        var analyticDto = new BudgetAnalyticDto
        {
            IrregularExpenses = budget.BudgetItems
                .Where(item => item.BudgetItemRegularityType == BudgetItemRegularityType.Irregular)
                .Sum(item => item.BudgetOperationCost),
            RegularExpenses = budget.BudgetItems
                .Where(item => item.BudgetItemRegularityType == BudgetItemRegularityType.Regular)
                .Sum(item => item.BudgetOperationCost),
            MoneyPreserved = budget.BudgetItems
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
                .Sum(item => item.BudgetOperationCost) * budget.PreserveFromIncomingPercent / 100,
            MoneyLeft = budget.BudgetItems
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
                .Sum(item => item.BudgetOperationCost) - budget.BudgetItems
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                .Sum(item => item.BudgetOperationCost),
            AverageDailyExpenses = GetAverageDailyExpenses(budget),
            ExpensesMedian = budget.BudgetItems
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                .Select(item => item.BudgetOperationCost).ToArray().GetMedianValue(),
        };

        return analyticDto;
    }

    private static decimal GetAverageDailyExpenses(Budget budget)
    {
        decimal avgDailyExpenses = 0;

        if (budget.BudgetItems.Any(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing))
        {
            avgDailyExpenses = budget.BudgetItems
                .GroupBy(item => item.PaymentDate.Date)
                .Average(dailyExpenses =>
                    dailyExpenses.Average(dailySpentItem => dailySpentItem.BudgetOperationCost));
        }

        return avgDailyExpenses;
    }
}
