import { BudgetItemDto } from '../budgets/budgetItemDto';

export interface BudgetItemsPaginatedResponseDto {
  budgetItems: BudgetItemDto[];
  totalItems: number;
  totalExpenses: string;
  totalIncoming: string;
}
