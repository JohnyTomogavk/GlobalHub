import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import { BUDGETS_API_BASE } from '../constants/apiConstants';
import * as apiConstants from '../constants/apiConstants';
import { PutRequest } from './base/apiServiceBase';
import { BudgetItemsRequestDto } from '../dto/budgetItems/budgetItemsRequestDto';
import { BudgetItemsPaginatedResponseDto } from '../dto/budgetItems/budgetItemsPaginatedResponseDto';

export const getBudgetItemsWithFiltersById = async (
  budgetId: number,
  budgetItemsRequestDto: BudgetItemsRequestDto
): Promise<AxiosResponse<BudgetItemsPaginatedResponseDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGET_ITEMS_BY_BUDGET_ID, budgetId);

  return PutRequest<BudgetItemsRequestDto, BudgetItemsPaginatedResponseDto>(resourceUrl, budgetItemsRequestDto);
};
