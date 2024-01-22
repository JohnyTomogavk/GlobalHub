import { BudgetItemOperationType } from '../../../enums/Budgets/budgetItemOperationType';

export interface BudgetItemTableEntry {
  key: number;
  title: string;
  description: string;
  operationType: BudgetItemOperationType;
  operationCost: string;
  operationDate: Date;
  tagIds: number[];
}
