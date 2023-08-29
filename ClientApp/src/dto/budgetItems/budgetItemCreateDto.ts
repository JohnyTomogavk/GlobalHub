import { BudgetItemOperationType } from '../../enums/budgetItemOperationType';
import { BudgetItemRegularityType } from '../../enums/budgetItemRegularityType';

export interface BudgetItemCreateDto {
  budgetId?: number;
  itemTitle: string;
  itemDescription: string;
  budgetItemOperationType: BudgetItemOperationType;
  budgetItemRegularityType: BudgetItemRegularityType;
  budgetOperationCost: string;
  paymentDate: Date;
  tagIds: number[];
}
