import useAxios from './useAxios';
import { BudgetItemsRequestDto } from '../../dto/budgetItems/budgetItemsRequestDto';
import { AxiosResponse } from 'axios';
import { BudgetItemsPaginatedResponseDto } from '../../dto/budgetItems/budgetItemsPaginatedResponseDto';
import { getResourceUrl } from '../../helpers/urlHelper';
import {
  BUDGETS_API_BASE,
  GET_BUDGET_ITEMS_BY_ID_AND_RANGE,
  GET_EXPENSES_SUM_GROUPED_BY_TAGS,
} from '../../constants/apiConstants';
import * as apiConstants from '../../constants/apiConstants';
import { BudgetItemCreateDto } from '../../dto/budgetItems/budgetItemCreateDto';
import { BudgetItemDto } from '../../dto/budgets/budgetItemDto';
import { BudgetItemUpdateDto } from '../../dto/budgetItems/budgetItemUpdateDto';
import { ExpenseOperationsSumDto } from '../../dto/budgetItems/expenseOperationsSumDto';

interface IBudgetItemsApi {
  getFiltered: (
    budgetId: number,
    budgetItemDto: BudgetItemsRequestDto
  ) => Promise<AxiosResponse<BudgetItemsPaginatedResponseDto>>;
  getExpensesSumsGroupedByTags: (budgetId: number) => Promise<AxiosResponse<ExpenseOperationsSumDto[]>>;
  create: (createDto: BudgetItemCreateDto) => Promise<AxiosResponse<BudgetItemDto>>;
  update: (updateDto: BudgetItemUpdateDto) => Promise<AxiosResponse<BudgetItemDto>>;
  delete: (budgetItemId: number) => Promise<AxiosResponse<number>>;
  getBudgetItemsByBudgetIdAndDates: (
    budgetId: number,
    startDateRange: Date,
    endDateRange: Date
  ) => Promise<AxiosResponse<BudgetItemDto[]>>;
}

const useBudgetsItemsApi = (): IBudgetItemsApi => {
  const { httpGet, httpPost, httpPut, httpDelete } = useAxios();

  return {
    getFiltered: (
      budgetId: number,
      budgetItemDto: BudgetItemsRequestDto
    ): Promise<AxiosResponse<BudgetItemsPaginatedResponseDto>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGET_ITEMS_BY_BUDGET_ID, budgetId);

      return httpPut(url, budgetItemDto);
    },
    create: (createDto: BudgetItemCreateDto): Promise<AxiosResponse<BudgetItemDto>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, apiConstants.CREATE_BUDGET_ITEM);

      return httpPost(url, createDto);
    },
    update: (updateDto: BudgetItemUpdateDto): Promise<AxiosResponse<BudgetItemDto>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, apiConstants.UPDATE_BUDGET_ITEM);

      return httpPut(url, updateDto);
    },
    delete: (budgetItemId: number): Promise<AxiosResponse<number>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, apiConstants.DELETE_BUDGET_ITEM_BY_ID);

      return httpDelete(url, {
        params: {
          budgetItemId: budgetItemId,
        },
      });
    },
    getExpensesSumsGroupedByTags: (budgetId: number): Promise<AxiosResponse<ExpenseOperationsSumDto[]>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, GET_EXPENSES_SUM_GROUPED_BY_TAGS);

      return httpGet(url, {
        params: { budgetId: budgetId },
      });
    },
    getBudgetItemsByBudgetIdAndDates: (
      budgetId: number,
      startDateRange: Date,
      endDateRange: Date
    ): Promise<AxiosResponse<BudgetItemDto[]>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, GET_BUDGET_ITEMS_BY_ID_AND_RANGE);

      return httpGet(url, {
        params: {
          budgetId: budgetId,
          startDateRange: startDateRange,
          endDateRange: endDateRange,
        },
      });
    },
  };
};

export default useBudgetsItemsApi;
