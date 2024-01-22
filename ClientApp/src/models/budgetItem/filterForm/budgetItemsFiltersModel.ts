import { BudgetItemOperationType } from '../../../enums/Budgets/budgetItemOperationType';

export interface BudgetItemsFiltersModel {
  budgetItemTitle?: string;
  budgetTagIds: number[];
  budgetItemOperationType?: BudgetItemOperationType;
  budgetItemDateRange: [StartDateRange?: Date, EndDateRange?: Date];
}
