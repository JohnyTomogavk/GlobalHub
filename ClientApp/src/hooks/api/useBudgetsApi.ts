import useAxios from './useAxios';
import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../../helpers/urlHelper';
import { BUDGETS_API_SUFFIX } from '../../constants/apiConstants';
import * as apiConstants from '../../constants/apiConstants';
import { BudgetMap } from '../../dto/sideMenu/budgetMap';
import { BudgetDto } from '../../dto/budgets/budgetDto';
import { CreateBudgetDto } from '../../dto/budgets/createBudgetDto';
import { BudgetAnalyticDto } from '../../dto/budgets/budgetAnalyticDto';

interface IBudgetsApi {
  getById: (id: number) => Promise<AxiosResponse<BudgetDto>>;
  updateDescription: (budgetId: number, description: string) => Promise<AxiosResponse>;
  updatePreservePercent: (budgetId: number, newPercentValue: number) => Promise<AxiosResponse<BudgetDto>>;
  getBudgetsMap: () => Promise<AxiosResponse<BudgetMap[]>>;
  create: (createDto: CreateBudgetDto) => Promise<AxiosResponse<BudgetDto>>;
  updateTitle: (budgetId: number, title: string) => Promise<AxiosResponse>;
  delete: (budgetId: number) => Promise<AxiosResponse<number>>;
  getAnalyticById: (budgetId: number) => Promise<AxiosResponse<BudgetAnalyticDto>>;
}

const useBudgetsApi = (): IBudgetsApi => {
  const { httpGet, httpPost, httpPut, httpDelete } = useAxios();

  return {
    getBudgetsMap: (): Promise<AxiosResponse<BudgetMap[]>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.GET_BUDGETS_MAP);

      return httpGet(url);
    },
    getById: (id: number): Promise<AxiosResponse<BudgetDto>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.GET_BUDGET_BY_ID);

      return httpGet(url, {
        params: {
          id: id,
        },
      });
    },
    create: (createDto: CreateBudgetDto): Promise<AxiosResponse<BudgetDto>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.CREATE_BUDGET);

      return httpPost(url, createDto);
    },
    updateTitle: (budgetId: number, title: string): Promise<AxiosResponse> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.UPDATE_BUDGET_TITLE);

      return httpPut(
        url,
        {
          title: title,
        },
        {
          params: {
            budgetId: budgetId,
          },
        }
      );
    },
    updateDescription: (budgetId: number, description: string): Promise<AxiosResponse> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.UPDATE_BUDGET_DESCRIPTION);

      return httpPut(
        url,
        {
          description: description,
        },
        {
          params: {
            budgetId: budgetId,
          },
        }
      );
    },
    delete: (budgetId: number): Promise<AxiosResponse<number>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.DELETE_BUDGET_BY_ID);

      return httpDelete(url, {
        params: {
          budgetId: budgetId,
        },
      });
    },
    updatePreservePercent: (budgetId: number, newPercentValue: number): Promise<AxiosResponse<BudgetDto>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.UPDATE_BUDGET_PRESERVE_PERCENT);

      return httpPut(
        url,
        {
          preservePercent: newPercentValue,
        },
        {
          params: {
            budgetId: budgetId,
          },
        }
      );
    },
    getAnalyticById: (budgetId: number): Promise<AxiosResponse<BudgetAnalyticDto>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, apiConstants.GET_BUDGETS_ANALYTIC_FOR_CURRENT_MONTH);

      return httpGet(url, {
        params: {
          id: budgetId,
        },
      });
    },
  };
};

export default useBudgetsApi;
