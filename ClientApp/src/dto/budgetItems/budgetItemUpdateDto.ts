import { BudgetItemCreateDto } from './budgetItemCreateDto';

export interface BudgetItemUpdateDto extends BudgetItemCreateDto {
  id: number;
}
