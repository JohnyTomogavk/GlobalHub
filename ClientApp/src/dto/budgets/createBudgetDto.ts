import { IHasDate } from '../../interfaces/IHasDate';

export interface CreateBudgetDto extends IHasDate {
  budgetTitle: string;
}
