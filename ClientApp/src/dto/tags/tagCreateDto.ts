import { BudgetTagColor } from '../../enums/Budgets/budgetTagColor';

export interface TagCreateDto {
  budgetId: number;
  label: string;
  color: BudgetTagColor;
}
