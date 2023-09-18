import { BudgetItemOperationType } from '../../../enums/budgetItemOperationType';
import dayjs from 'dayjs';

export interface BudgetItemDrawerModel {
  title: string;
  description: string;
  operationDate: dayjs.Dayjs;
  operationCost: string;
  operationType: BudgetItemOperationType;
  selectedTags: (number | string)[];
  budgetItemId?: number;
}
