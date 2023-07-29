import { GetRequest, PostRequest } from './base/apiServiceBase';
import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import * as apiConstants from '../constants/apiConstants';
import { BudgetMap } from '../dto/sideMenu/budgetMap';
import { BUDGETS_API_BASE } from '../constants/apiConstants';
import { CreateBudgetDto } from '../dto/budgets/createBudgetDto';
import { BudgetDto } from '../dto/budgets/budgetDto';

export const getBudgetsMap = async (): Promise<AxiosResponse<BudgetMap[]>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGETS_MAP);

  return GetRequest<undefined, BudgetMap[]>(resourceUrl, undefined);
};

export const getBudgetById = async (id: number): Promise<AxiosResponse<BudgetDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGET_BY_ID, id);

  return GetRequest<undefined, BudgetDto>(resourceUrl, undefined);
};

export const createNewBudget = async (createDto: CreateBudgetDto): Promise<AxiosResponse<BudgetDto>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.CREATE_BUDGET);

  return PostRequest<CreateBudgetDto, BudgetDto>(resourceUrl, createDto);
};
