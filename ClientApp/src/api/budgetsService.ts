import { DeleteRequest, GetRequest, PostRequest, PutRequest } from './base/apiServiceBase';
import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import * as apiConstants from '../constants/apiConstants';
import { BudgetMap } from '../dto/sideMenu/budgetMap';
import { BUDGETS_API_BASE, UPDATE_BUDGET_PRESERVE_PERCENT } from '../constants/apiConstants';
import { CreateBudgetDto } from '../dto/budgets/createBudgetDto';
import { BudgetDto } from '../dto/budgets/budgetDto';
import { BudgetAnalyticDto } from '../dto/budgets/budgetAnalyticDto';

export const getBudgetsMap = async (): Promise<AxiosResponse<BudgetMap[]>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGETS_MAP);

  return GetRequest<BudgetMap[]>(resourceUrl);
};

export const getBudgetById = async (id: number): Promise<AxiosResponse<BudgetDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGET_BY_ID);

  return GetRequest<BudgetDto>(resourceUrl, {
    id: id,
  });
};

export const createNewBudget = async (createDto: CreateBudgetDto): Promise<AxiosResponse<BudgetDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.CREATE_BUDGET);

  return PostRequest<CreateBudgetDto, BudgetDto>(resourceUrl, createDto);
};

export const getBudgetAnalyticForCurrentMonthById = async (
  budgetId: number
): Promise<AxiosResponse<BudgetAnalyticDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGETS_ANALYTIC_FOR_CURRENT_MONTH);

  return GetRequest<BudgetAnalyticDto>(resourceUrl, {
    id: budgetId,
  });
};

export const updateBudgetTitle = async (budgetId: number, title: string): Promise<AxiosResponse> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.UPDATE_BUDGET_TITLE);

  return PutRequest<object, void>(
    resourceUrl,
    {
      title: title,
    },
    {
      params: {
        budgetId: budgetId,
      },
    }
  );
};

export const updateBudgetDescription = async (budgetId: number, description: string): Promise<AxiosResponse> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.UPDATE_BUDGET_DESCRIPTION);

  return PutRequest<object, void>(
    resourceUrl,
    {
      description: description,
    },
    {
      params: {
        budgetId: budgetId,
      },
    }
  );
};

export const deleteBudgetById = async (budgetId: number): Promise<AxiosResponse<number>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.DELETE_BUDGET_BY_ID);

  return DeleteRequest<object, number>(resourceUrl, {
    budgetId: budgetId,
  });
};

export const updatePreservePercent = async (budgetId: number, newPercentValue: number): Promise<AxiosResponse> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.UPDATE_BUDGET_PRESERVE_PERCENT);

  return PutRequest<object, undefined>(
    resourceUrl,
    {
      preservePercent: newPercentValue,
    },
    {
      params: {
        budgetId: budgetId,
      },
    }
  );
};
