import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import { BUDGETS_API_BASE, CREATE_BUDGET_ITEM } from '../constants/apiConstants';
import * as apiConstants from '../constants/apiConstants';
import { DeleteRequest, PostRequest, PutRequest } from './base/apiServiceBase';
import { BudgetItemsRequestDto } from '../dto/budgetItems/budgetItemsRequestDto';
import { BudgetItemsPaginatedResponseDto } from '../dto/budgetItems/budgetItemsPaginatedResponseDto';
import { BudgetItemCreateDto } from '../dto/budgetItems/budgetItemCreateDto';
import { BudgetItemDto } from '../dto/budgets/budgetItemDto';

export const getBudgetItemsWithFiltersById = async (
  budgetId: number,
  budgetItemsRequestDto: BudgetItemsRequestDto
): Promise<AxiosResponse<BudgetItemsPaginatedResponseDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGET_ITEMS_BY_BUDGET_ID, budgetId);

  return PutRequest<BudgetItemsRequestDto, BudgetItemsPaginatedResponseDto>(resourceUrl, budgetItemsRequestDto);
};

export const deleteBudgetById = async (budgetId: number): Promise<AxiosResponse<number>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.DELETE_BUDGET_BY_ID);

  return DeleteRequest<object, number>(resourceUrl, {
    budgetId: budgetId,
  });
};

export const createBudgetItem = async (createDto: BudgetItemCreateDto): Promise<AxiosResponse<BudgetItemDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.CREATE_BUDGET_ITEM);

  return PostRequest<BudgetItemCreateDto, BudgetItemDto>(resourceUrl, createDto);
};
