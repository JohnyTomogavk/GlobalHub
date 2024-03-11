namespace BudgetsService.Business.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<Budget> _budgetValidator;
    private readonly IValidator<UpdateBudgetPreservePercentDto> _preservePercentDto;
    private readonly IAuthorizationService<Budget> _budgetAuthorizationService;
    private readonly IUserService _userService;
    private readonly IPublishEndpoint _publishEndpoint;

    public BudgetService(
        IBudgetRepository budgetRepository,
        IMapper mapper,
        IValidator<Budget> budgetValidator,
        IValidator<UpdateBudgetPreservePercentDto> preservePercentDto,
        IAuthorizationService<Budget> budgetAuthorizationService,
        IUserService userService,
        IPublishEndpoint publishEndpoint)
    {
        _budgetRepository = budgetRepository;
        _mapper = mapper;
        _budgetValidator = budgetValidator;
        _preservePercentDto = preservePercentDto;
        _budgetAuthorizationService = budgetAuthorizationService;
        _userService = userService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<IEnumerable<BudgetMap>> GetUserBudgetsMapAsync(string userId)
    {
        var userBudgets = await _budgetRepository.GetUserBudgetsAsync(userId);

        var ids = userBudgets.Select(budget => budget.Id);
        var authorized = await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, ids);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var maps = _mapper.Map<IEnumerable<BudgetMap>>(userBudgets);

        return maps;
    }

    public async Task<BudgetDto?> GetBudgetByIdAsync(long budgetId)
    {
        var authorized = await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

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
            throw new ValidationException(validationResult.Errors);
        }

        var createdEntity = await _budgetRepository.AddBudget(newBudget);
        var budgetDto = _mapper.Map<BudgetDto>(createdEntity);

        return budgetDto;
    }

    public async Task<BudgetAnalyticDto> GetBudgetAnalytic(long budgetId, DateTimeRange dateRange)
    {
        var authorized = await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var budget = await _budgetRepository.GetBudgetByIdWithIncludeAsync(budgetId, budget => budget.BudgetItems);

        if (budget == null)
        {
            throw new EntityNotFoundException("Budget is not found");
        }

        var analyticDto = GetBudgetAnalytic(budget, dateRange);

        return analyticDto;
    }

    public async Task<long> DeleteBudgetById(long id)
    {
        var authorized = await _budgetAuthorizationService.AuthorizeDelete(_userService.UserId, id);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var budgetToDelete = await _budgetRepository.GetBudgetByIdWithIncludeAsync(id);

        if (budgetToDelete == null)
        {
            throw new EntityNotFoundException("Budget is not found");
        }

        var deletedEntity = await _budgetRepository.DeleteById(budgetToDelete);

        return deletedEntity.Id;
    }

    public async Task<BudgetDto> UpdateBudgetTitle(long budgetId, string title)
    {
        var authorized = await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var budget = await _budgetRepository.GetBudgetByIdWithIncludeAsync(budgetId);

        if (budget == null)
        {
            throw new EntityNotFoundException("Budget is not found");
        }

        budget.BudgetTitle = title;
        var updatedBudget = await _budgetRepository.UpdateBudget(budget);

        return _mapper.Map<BudgetDto>(updatedBudget);
    }

    public async Task<BudgetDto> UpdateBudgetDescription(long budgetId, string description)
    {
        var authorized = await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var budget = await _budgetRepository.GetBudgetByIdWithIncludeAsync(budgetId);

        if (budget == null)
        {
            throw new EntityNotFoundException("Budget is not found");
        }

        budget.BudgetDescription = description;
        var updatedBudget = await _budgetRepository.UpdateBudget(budget);

        return _mapper.Map<BudgetDto>(updatedBudget);
    }

    public async Task<BudgetDto> UpdatePreservePercent(long budgetId, UpdateBudgetPreservePercentDto dto)
    {
        var authorized = await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var validationResult = await this._preservePercentDto.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var budget = await _budgetRepository.GetBudgetByIdWithIncludeAsync(budgetId);

        if (budget == null)
        {
            throw new EntityNotFoundException("Budget is not found");
        }

        budget.PreserveFromIncomingPercent = dto.PreservePercent;
        var updatedBudget = await _budgetRepository.UpdateBudget(budget);

        return _mapper.Map<BudgetDto>(updatedBudget);
    }

    private BudgetAnalyticDto GetBudgetAnalytic(Budget budget, DateTimeRange dateRange)
    {
        var currentMonthOperations =
            budget.BudgetItems.IsOperationDateBetween(dateRange.StartRangeDate, dateRange.EndRangeDate).ToArray();

        var allBudgetOperations = budget.BudgetItems.ToArray();

        decimal moneyPreserved = currentMonthOperations
            .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
            .Sum(item => item.OperationCost) * budget.PreserveFromIncomingPercent / 100;

        var analyticDto = new BudgetAnalyticDto
        {
            IrregularExpenses = currentMonthOperations
                .Where(item =>
                    item is
                    {
                        BudgetItemRegularityType: BudgetItemRegularityType.Irregular,
                        BudgetItemOperationType: BudgetItemOperationType.Outgoing
                    })
                .Sum(item => item.OperationCost),
            RegularExpenses = currentMonthOperations
                .Where(item =>
                    item is
                    {
                        BudgetItemRegularityType: BudgetItemRegularityType.Regular,
                        BudgetItemOperationType: BudgetItemOperationType.Outgoing
                    })
                .Sum(item => item.OperationCost),
            MoneyPreserved = moneyPreserved,
            MoneyLeft = allBudgetOperations
                            .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
                            .Sum(item => item.OperationCost) -
                        allBudgetOperations
                            .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                            .Sum(item => item.OperationCost) - moneyPreserved,
            AverageDailyExpenses = GetAverageDailyExpenses(currentMonthOperations),
            ExpensesMedian = currentMonthOperations
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                .Select(item => item.OperationCost).ToArray().GetMedianValue(),
        };

        return analyticDto;
    }

    private static decimal GetAverageDailyExpenses(BudgetItem[] budgetItems)
    {
        var expenses = budgetItems.Where(budgetItem =>
            budgetItem.BudgetItemOperationType == BudgetItemOperationType.Outgoing).ToList();

        decimal avgDailyExpenses = 0;

        if (expenses.Any())
        {
            avgDailyExpenses = expenses
                .GroupBy(item => item.OperationDate.Date)
                .Average(dailyExpenses =>
                    dailyExpenses.Average(dailySpentItem => dailySpentItem.OperationCost));
        }

        return avgDailyExpenses;
    }
}
