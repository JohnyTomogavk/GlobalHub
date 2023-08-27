import { BudgetItemOperationType } from '../../../enums/budgetItemOperationType';

export interface BudgetItemTableEntry {
  key: number;
  title: string;
  description: string;
  operationType: BudgetItemOperationType;
  operationCost: string;
  operationDate: Date;
  tagIds: number[];
}
