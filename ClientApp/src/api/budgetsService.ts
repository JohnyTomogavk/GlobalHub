import { GetRequest } from './base/apiServiceBase';
import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import * as apiConstants from '../constants/apiConstants';
import { BudgetMap } from '../dto/sideMenu/budgetMap';
import { BUDGETS_API_BASE } from '../constants/apiConstants';
export const getBudgetsMap = async (): Promise<AxiosResponse<BudgetMap[]>> => {
  const resourceUrl = getResourceUrl(BUDGETS_API_BASE, apiConstants.GET_BUDGETS_MAP);

  return GetRequest<BudgetMap[], undefined>(resourceUrl);
};
