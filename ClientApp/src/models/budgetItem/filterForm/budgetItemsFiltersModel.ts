import { BudgetItemOperationType } from '../../../enums/budgetItemOperationType';

export interface BudgetItemsFiltersModel {
  budgetItemTitle?: string;
  budgetTagIds: number[];
  budgetItemOperationType?: BudgetItemOperationType;
  budgetItemDateRange: [StartDateRange?: Date, EndDateRange?: Date];
}
