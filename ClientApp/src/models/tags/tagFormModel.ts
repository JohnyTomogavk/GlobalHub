import { BudgetTagColor } from '../../enums/Budgets/budgetTagColor';

export interface TagFormModel {
  id: number;
  label: string;
  color: BudgetTagColor;
}
