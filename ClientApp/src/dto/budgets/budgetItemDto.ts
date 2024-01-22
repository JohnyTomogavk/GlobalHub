import { BudgetItemOperationType } from '../../enums/Budgets/budgetItemOperationType';
import { IHasDate } from '../../interfaces/IHasDate';
import { BudgetItemRegularityType } from '../../enums/Budgets/budgetItemRegularityType';

export interface BudgetItemDto extends IHasDate {
  id: number;
  itemTitle: string;
  itemDescription: string;
  budgetItemOperationType: BudgetItemOperationType;
  budgetItemRegularityType: BudgetItemRegularityType;
  operationCost: number;
  operationDate: Date;
  tagIds: number[];
}
