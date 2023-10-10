import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import {
  BUDGETS_API_BASE,
  GET_BUDGET_ITEMS_BY_ID_AND_RANGE,
  GET_EXPENSES_SUM_GROUPED_BY_TAGS,
} from '../constants/apiConstants';
import * as apiConstants from '../constants/apiConstants';
import { DeleteRequest, GetRequest, PostRequest, PutRequest } from './base/apiServiceBase';
import { BudgetItemsRequestDto } from '../dto/budgetItems/budgetItemsRequestDto';
import { BudgetItemsPaginatedResponseDto } from '../dto/budgetItems/budgetItemsPaginatedResponseDto';
import { BudgetItemCreateDto } from '../dto/budgetItems/budgetItemCreateDto';
import { BudgetItemDto } from '../dto/budgets/budgetItemDto';
import { BudgetItemUpdateDto } from '../dto/budgetItems/budgetItemUpdateDto';
import { ExpenseOperationsSumDto } from '../dto/budgetItems/expenseOperationsSumDto';
import { BudgetItemExpenseSumByDay } from '../dto/budgetItems/budgetItemExpenseSumByDay';

export const getBudgetItemsWithFiltersById = async (
  budgetId: number,
  budgetItemsRequestDto: BudgetItemsRequestDto
): Promise<AxiosResponse<BudgetItemsPaginatedResponseDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGET_ITEMS_BY_BUDGET_ID, budgetId);

  return PutRequest<BudgetItemsRequestDto, BudgetItemsPaginatedResponseDto>(resourceUrl, budgetItemsRequestDto);
};

export const createBudgetItem = async (createDto: BudgetItemCreateDto): Promise<AxiosResponse<BudgetItemDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.CREATE_BUDGET_ITEM);

  return PostRequest<BudgetItemCreateDto, BudgetItemDto>(resourceUrl, createDto);
};

export const updateBudgetItem = async (updateDto: BudgetItemUpdateDto): Promise<AxiosResponse<BudgetItemDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.UPDATE_BUDGET_ITEM);

  return PutRequest<BudgetItemUpdateDto, BudgetItemDto>(resourceUrl, updateDto);
};

export const deleteBudgetItemById = async (budgetItemId: number): Promise<AxiosResponse<number>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.DELETE_BUDGET_ITEM_BY_ID);

  return DeleteRequest<object, number>(resourceUrl, {
    budgetItemId: budgetItemId,
  });
};

export const getExpensesSumsGroupedByTags = async (
  budgetId: number
): Promise<AxiosResponse<ExpenseOperationsSumDto[]>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, GET_EXPENSES_SUM_GROUPED_BY_TAGS);

  return GetRequest<ExpenseOperationsSumDto[]>(url, { budgetId: budgetId });
};

export const getBudgetItemsByBudgetIdAndDates = async (
  budgetId: number,
  startDateRange: Date,
  endDateRange: Date
): Promise<AxiosResponse<BudgetItemDto[]>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, GET_BUDGET_ITEMS_BY_ID_AND_RANGE);

  return GetRequest<BudgetItemDto[]>(url, {
    budgetId: budgetId,
    startDateRange: startDateRange,
    endDateRange: endDateRange,
  });
};
