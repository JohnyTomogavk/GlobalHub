import { BaseSearchItem } from './baseSearchItem';

export interface BudgetItemSearchItem extends BaseSearchItem {
  budgetItemTitle: string;
  budgetTitle: string;
  budgetItemId: number;
  budgetId: number;
}
