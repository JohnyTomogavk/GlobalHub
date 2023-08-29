using Microsoft.EntityFrameworkCore;

namespace BudgetsService.Business.Services;

public class BudgetItemService : IBudgetItemService
{
    private readonly IBudgetItemRepository _budgetItemRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<BudgetItemCreateDto> _createDtoValidator;

    public BudgetItemService(IBudgetItemRepository budgetItemRepository, IMapper mapper,
        IValidator<BudgetItemCreateDto> createDtoValidator)
    {
        _budgetItemRepository = budgetItemRepository;
        _mapper = mapper;
        _createDtoValidator = createDtoValidator;
    }

    public async Task<BudgetItemPaginatedResponse> GetBudgetItemsByBudgetId(long id, DateTimeRange datePeriod,
        BudgetItemsQueryOptions queryOptions)
    {
        var budgetItemsQueryExpression = _budgetItemRepository.GetBudgetItemsByIdAndPeriodAsIQueryable(id, datePeriod);
        budgetItemsQueryExpression = ApplyFilters(budgetItemsQueryExpression, queryOptions.FilterModelDto);
        budgetItemsQueryExpression =
            ApplySort(budgetItemsQueryExpression, queryOptions.SortColumn, queryOptions.SortByAscending);

        var aggregationMetrics = new
        {
            ItemsCount = budgetItemsQueryExpression.Count(),
            TotalExpenses = budgetItemsQueryExpression
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Outgoing)
                .Sum(item => item.BudgetOperationCost),
            TotalIncoming = budgetItemsQueryExpression
                .Where(item => item.BudgetItemOperationType == BudgetItemOperationType.Incoming)
                .Sum(item => item.BudgetOperationCost),
        };

        budgetItemsQueryExpression = ApplyPagination(budgetItemsQueryExpression, queryOptions.ItemsPerPageCount,
            queryOptions.PageNumber);

        var budgetItems = await budgetItemsQueryExpression.ToListAsync();
        var budgetItemsDto = _mapper.Map<IEnumerable<BudgetItemDto>>(budgetItems);

        var responseDto = new BudgetItemPaginatedResponse()
        {
            BudgetItems = budgetItemsDto,
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

    private IQueryable<BudgetItem> ApplySort(IQueryable<BudgetItem> budgetItems, string orderByColumn,
        bool sortByAscending)
    {
        if (string.IsNullOrEmpty(orderByColumn))
        {
            return budgetItems;
        }

        return sortByAscending
            ? budgetItems.OrderBy(item => EF.Property<string>(item, orderByColumn))
            : budgetItems.OrderByDescending(item => EF.Property<string>(item, orderByColumn));
    }

    private IQueryable<BudgetItem> ApplyPagination(IQueryable<BudgetItem> budgetItems, int itemsCountPerPage,
        int pageNumber)
    {
        return budgetItems.Skip(pageNumber * itemsCountPerPage).Take(itemsCountPerPage);
    }

    private IQueryable<BudgetItem> ApplyFilters(IQueryable<BudgetItem> budgetItems, FilterModelDto filterModel)
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
                item.PaymentDate >= filterModel.StartDateRange && item.PaymentDate <= filterModel.EndDateRange);
        }

        if (filterModel.TagIds != null && filterModel.TagIds.Any())
        {
            budgetItems = budgetItems.Where(item => item.BudgetItemTags.Any(t => filterModel.TagIds.Contains(t.TagId)));
        }

        return budgetItems;
    }
}
