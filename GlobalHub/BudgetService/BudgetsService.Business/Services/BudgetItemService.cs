namespace BudgetsService.Business.Services;

public class BudgetItemService : IBudgetItemService
{
    private readonly IBudgetItemRepository _budgetItemRepository;
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<BudgetItemCreateDto> _createDtoValidator;
    private readonly IValidator<BudgetItemUpdateDto> _updateDtoValidator;

    public BudgetItemService(IBudgetItemRepository budgetItemRepository, ITagRepository tagRepository, IMapper mapper,
        IValidator<BudgetItemCreateDto> createDtoValidator, IValidator<BudgetItemUpdateDto> updateDtoValidator)
    {
        _budgetItemRepository = budgetItemRepository;
        _tagRepository = tagRepository;
        _mapper = mapper;
        _createDtoValidator = createDtoValidator;
        _updateDtoValidator = updateDtoValidator;
    }

    public async Task<BudgetItemPaginatedResponse> GetBudgetItemsByBudgetId(long id,
        BudgetItemsQueryOptions queryOptions)
    {
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
        var validationResult = await _createDtoValidator.ValidateAsync(createDto);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var createModel = _mapper.Map<BudgetItem>(createDto);
        var createdBudgetItem = await _budgetItemRepository.CreateBudgetItem(createModel);
        var createdBudgetItemDto = _mapper.Map<BudgetItemDto>(createdBudgetItem);

        return createdBudgetItemDto;
    }

    public async Task<BudgetItemDto> UpdateBudgetItemTags(long budgetItemId, IEnumerable<long> tagsIds)
    {
        var budgetItemTags = tagsIds.Select(tagId => new BudgetItemTag { BudgetItemId = budgetItemId, TagId = tagId })
            .ToList();
        var updatedBudgetItem = await _budgetItemRepository.UpdateBudgetItemTags(budgetItemId, budgetItemTags);
        var mappedEntity = _mapper.Map<BudgetItemDto>(updatedBudgetItem);

        return mappedEntity;
    }

    public async Task<BudgetItemDto> UpdateBudgetItem(BudgetItemUpdateDto updateDto)
    {
        var validationResult = await _updateDtoValidator.ValidateAsync(updateDto);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var budgetItem = await _budgetItemRepository.GetBudgetItemById(updateDto.Id);
        var entityToUpdate = _mapper.Map<BudgetItemUpdateDto, BudgetItem>(updateDto, budgetItem);
        var updateEntity = await _budgetItemRepository.UpdateBudgetItem(entityToUpdate);
        var mappedEntity = _mapper.Map<BudgetItemDto>(updateEntity);

        return mappedEntity;
    }

    public async Task DeleteBudgetItem(long budgetItemId)
    {
        var budgetItem = await _budgetItemRepository.GetBudgetItemById(budgetItemId);

        if (budgetItem == null)
        {
            throw new EntityNotFoundException("Budget Item not found");
        }

        await _budgetItemRepository.DeleteBudgetItemAsync(budgetItem);
    }

    public async Task<IEnumerable<ExpenseOperationsSumDto>> GetExpensesSumsGroupedByTags(long budgetId,
        DateTimeRange currentBudgetPeriod)
    {
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
}
