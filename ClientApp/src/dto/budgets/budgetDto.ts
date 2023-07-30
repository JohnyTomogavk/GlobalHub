import { IHasDate } from '../../interfaces/IHasDate';
import { BudgetItemDto } from './budgetItemDto';

export interface BudgetDto extends IHasDate {
  id: number;
  budgetTitle: string;
  budgetDescription: string;
  budgetItems: BudgetItemDto[];
}
