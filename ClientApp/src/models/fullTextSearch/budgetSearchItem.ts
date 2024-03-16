import { BaseSearchItem } from './baseSearchItem';

export interface BudgetSearchItem extends BaseSearchItem {
  title: string;
  budgetId: number;
}
