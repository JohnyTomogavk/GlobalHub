using Common.EventBus.Messages.FullTextSearchModels.Budgets;

namespace BudgetsService.Business.Services;

public class BudgetItemService : IBudgetItemService
{
    private readonly IBudgetItemRepository _budgetItemRepository;
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<BudgetItemCreateDto> _createDtoValidator;
    private readonly IValidator<BudgetItemUpdateDto> _updateDtoValidator;
    private readonly IAuthorizationService<Budget> _budgetAuthorizationService;
    private readonly IUserService _userService;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ApplicationDbContext _dbContext;

    public BudgetItemService(IBudgetItemRepository budgetItemRepository,
        ITagRepository tagRepository,
        IMapper mapper,
        IValidator<BudgetItemCreateDto> createDtoValidator,
        IValidator<BudgetItemUpdateDto> updateDtoValidator,
        IAuthorizationService<Budget> budgetAuthorizationService,
        IUserService userService,
        IPublishEndpoint publishEndpoint,
        ApplicationDbContext dbContext)
    {
        _budgetItemRepository = budgetItemRepository;
        _tagRepository = tagRepository;
        _mapper = mapper;
        _createDtoValidator = createDtoValidator;
        _updateDtoValidator = updateDtoValidator;
        _budgetAuthorizationService = budgetAuthorizationService;
        _userService = userService;
        _publishEndpoint = publishEndpoint;
        _dbContext = dbContext;
    }

    public async Task<BudgetItemPaginatedResponse> GetBudgetItemsByBudgetId(long id,
        BudgetItemsQueryOptions queryOptions)
    {
        var authorized = await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, id);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var budgetItemsQueryExpression = _budgetItemRepository.GetBudgetItemsByIdAndPeriodAsIQueryable(id);
        budgetItemsQueryExpression = ApplyFilters(budgetItemsQueryExpression, queryOptions.FilterModelDto);
        budgetItemsQueryExpression =
            budgetItemsQueryExpression.ApplySort(queryOptions.SortColumn, queryOptions.SortByAscending);

        var aggregationMetrics = new
        {
            ItemsCount = budgetItemsQueryExpression.Count(),
            TotalExpenses = budgetItemsQueryExpression
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                .Sum(item => item.OperationCost),
            TotalIncoming = budgetItemsQueryExpression
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
                .Sum(item => item.OperationCost),
        };

        budgetItemsQueryExpression = budgetItemsQueryExpression.ApplyPagination(queryOptions.ItemsPerPageCount,
            queryOptions.PageNumber);

        var budgetItems = await budgetItemsQueryExpression.ToListAsync();
        var mappedBudgetItems = _mapper.Map<IEnumerable<BudgetItemDto>>(budgetItems);

        var responseDto = new BudgetItemPaginatedResponse()
        {
            BudgetItems = mappedBudgetItems,
            TotalItems = aggregationMetrics.ItemsCount,
            TotalExpenses = aggregationMetrics.TotalExpenses,
            TotalIncoming = aggregationMetrics.TotalIncoming
        };

        return responseDto;
    }

    public async Task<BudgetItemDto> CreateBudgetItem(BudgetItemCreateDto createDto)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, createDto.BudgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var validationResult = await _createDtoValidator.ValidateAsync(createDto);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var createModel = _mapper.Map<BudgetItem>(createDto);
        var createdBudgetItem = await _budgetItemRepository.CreateBudgetItem(createModel);
        var createdBudgetItemDto = _mapper.Map<BudgetItemDto>(createdBudgetItem);
        await this.UpdateBudgetItemTags(createdBudgetItemDto.Id, createDto.TagIds);

        await this.IndexCreatedBudget(createdBudgetItem.Id);

        return createdBudgetItemDto;
    }

    public async Task<BudgetItemDto> UpdateBudgetItemTags(long budgetItemId, IEnumerable<long> tagsIds)
    {
        var budgetItemTags = tagsIds.Select(tagId => new BudgetItemTag { BudgetItemId = budgetItemId, TagId = tagId })
            .ToList();

        var budgetItemToUpdate =
            await _budgetItemRepository.GetBudgetItemByIdWithIncludeAsync(budgetItemId, bi => bi.BudgetItemTags);

        var authorized =
            await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, budgetItemToUpdate.BudgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        if (budgetItemToUpdate == null)
        {
            throw new EntityNotFoundException("Budget item is not found");
        }

        budgetItemToUpdate.BudgetItemTags = budgetItemTags;
        await _budgetItemRepository.UpdateBudgetItem(budgetItemToUpdate);
        var mappedEntity = _mapper.Map<BudgetItemDto>(budgetItemToUpdate);

        return mappedEntity;
    }

    public async Task<BudgetItemDto> UpdateBudgetItem(BudgetItemUpdateDto updateDto)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, updateDto.BudgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var validationResult = await _updateDtoValidator.ValidateAsync(updateDto);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var budgetItem = await _budgetItemRepository.GetBudgetItemById(updateDto.Id);

        if (budgetItem == null)
        {
            throw new EntityNotFoundException("Budget item is not found");
        }

        var entityToUpdate = _mapper.Map<BudgetItemUpdateDto, BudgetItem>(updateDto, budgetItem);
        var updateEntity = await _budgetItemRepository.UpdateBudgetItem(entityToUpdate);
        var mappedEntity = _mapper.Map<BudgetItemDto>(updateEntity);

        return mappedEntity;
    }

    public async Task DeleteBudgetItem(long budgetItemId)
    {
        var budgetItem = await _budgetItemRepository.GetBudgetItemById(budgetItemId);

        var authorized = await _budgetAuthorizationService.AuthorizeUpdate(_userService.UserId, budgetItem.BudgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        if (budgetItem == null)
        {
            throw new EntityNotFoundException("Budget Item is not found");
        }

        await _budgetItemRepository.DeleteBudgetItemAsync(budgetItem);
    }

    public async Task<IEnumerable<ExpenseOperationsSumDto>> GetExpensesSumsGroupedByTags(long budgetId,
        DateTimeRange currentBudgetPeriod)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var groupedSums = await _tagRepository.GetExpensesSumsGroupedByTags(budgetId,
            currentBudgetPeriod.StartRangeDate, currentBudgetPeriod.EndRangeDate);

        var sumsDto = groupedSums.Select(sum => new ExpenseOperationsSumDto
        {
            TagId = sum.Key, OperationsSum = sum.Value,
        });

        return sumsDto;
    }

    public async Task<IEnumerable<BudgetItemDto>> GetBudgetItemsByIdAndRange(long budgetId, DateTime startDateRange,
        DateTime endDateRange)
    {
        var authorized =
            await _budgetAuthorizationService.AuthorizeRead(_userService.UserId, budgetId);
        if (!authorized)
        {
            throw new AccessDeniedException("Access denied");
        }

        var budgetItems =
            await _budgetItemRepository.GetBudgetItemsByIdAndDateRange(budgetId, startDateRange, endDateRange);

        return _mapper.Map<IEnumerable<BudgetItemDto>>(budgetItems);
    }

    private static IQueryable<BudgetItem> ApplyFilters(IQueryable<BudgetItem> budgetItems, FilterModelDto filterModel)
    {
        if (filterModel == null)
        {
            return budgetItems;
        }

        if (!string.IsNullOrEmpty(filterModel.Title))
        {
            budgetItems = budgetItems.Where(item => item.ItemTitle.Contains(filterModel.Title));
        }

        if (filterModel.BudgetItemOperationType != null)
        {
            budgetItems =
                budgetItems.Where(item => item.BudgetItemOperationType == filterModel.BudgetItemOperationType);
        }

        if (filterModel.StartDateRange != null && filterModel.EndDateRange != null)
        {
            budgetItems = budgetItems.Where(item =>
                item.OperationDate >= filterModel.StartDateRange && item.OperationDate <= filterModel.EndDateRange);
        }

        if (filterModel.TagIds != null && filterModel.TagIds.Any())
        {
            budgetItems = budgetItems.Where(item => item.BudgetItemTags.Any(t => filterModel.TagIds.Contains(t.TagId)));
        }

        return budgetItems;
    }

    private async Task IndexCreatedBudget(long budgetItemId)
    {
        var budgetItemToIndex = await this._dbContext.BudgetsItems
            .Include(t => t.Budget)
            .Include(t => t.BudgetItemTags)
            .ThenInclude(t => t.Tag)
            .SingleOrDefaultAsync(t => t.Id == budgetItemId);

        var searchItem = this._mapper.Map<BudgetItemSearchItem>(budgetItemToIndex);
        await this._publishEndpoint.Publish(searchItem);
    }
}
