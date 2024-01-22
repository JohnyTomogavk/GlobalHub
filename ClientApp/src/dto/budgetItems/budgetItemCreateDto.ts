import { BudgetItemOperationType } from '../../enums/Budgets/budgetItemOperationType';
import { BudgetItemRegularityType } from '../../enums/Budgets/budgetItemRegularityType';

export interface BudgetItemCreateDto {
  budgetId?: number;
  itemTitle: string;
  itemDescription: string;
  budgetItemOperationType: BudgetItemOperationType;
  budgetItemRegularityType: BudgetItemRegularityType;
  operationCost: string;
  operationDate: Date;
  tagIds: number[];
}
