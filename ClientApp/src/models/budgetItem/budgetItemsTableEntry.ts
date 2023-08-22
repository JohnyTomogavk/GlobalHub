export interface BudgetItemTableEntry {
  key: number;
  title: string;
  operationType: string;
  operationCost: string;
  paymentDate: Date;
  tagIds: number[];
}
