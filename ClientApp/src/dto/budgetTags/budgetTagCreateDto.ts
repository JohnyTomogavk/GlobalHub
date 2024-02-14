import { TagColor } from '../../enums/shared/tagColor';

export interface BudgetTagCreateDto {
  budgetId: number;
  label: string;
  color: TagColor;
}
