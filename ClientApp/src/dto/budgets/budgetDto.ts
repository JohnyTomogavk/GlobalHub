import { IHasDate } from '../../interfaces/IHasDate';

export interface BudgetDto extends IHasDate {
  id: number;
  budgetTitle: string;
  budgetDescription: string;
  preserveFromIncomingPercent: number;
}
