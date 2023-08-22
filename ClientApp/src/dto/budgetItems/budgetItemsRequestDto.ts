import { BudgetItemOperationType } from '../../enums/budgetItemOperationType';

export interface BudgetItemsRequestDto {
  pageNumber: number;
  itemsPerPageCount: number;
  sortColumn?: string;
  sortByAscending?: boolean;
  filterModelDto: {
    title?: string;
    budgetItemOperationType?: BudgetItemOperationType;
    tagIds: number[];
    startDateRange?: Date;
    endDateRange?: Date;
  };
}
