import { BudgetOperationType } from '../../enums/budgetOperationType';
import { IHasDate } from '../../interfaces/IHasDate';

export interface BudgetItemDto extends IHasDate {
  id: number;
  itemTitle: string;
  itemDescription: string;
  budgetOperationType: BudgetOperationType;
  budgetOperationCost: number;
}
