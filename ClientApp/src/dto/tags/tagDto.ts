import { BudgetTagColor } from '../../enums/Budgets/budgetTagColor';

export interface TagDto {
  id: number;
  label: string;
  color: BudgetTagColor;
}
