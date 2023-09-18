import { BudgetItemOperationType } from '../../enums/budgetItemOperationType';
import { IHasDate } from '../../interfaces/IHasDate';
import { BudgetItemRegularityType } from '../../enums/budgetItemRegularityType';

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
