import { BudgetItemTableEntry } from '../models/budgetItem/budgetItemsTable/budgetItemsTableEntry';
import { BudgetItemDrawerModel } from '../models/budgetItem/budgetItemDrawer/budgetItemDrawerModel';
import dayjs from 'dayjs';

export const budgetItemTableEntryToDrawerModel = (tableEntry: BudgetItemTableEntry): BudgetItemDrawerModel => ({
  budgetItemId: tableEntry.key,
  title: tableEntry.title,
  description: tableEntry.description,
  operationCost: tableEntry.operationCost,
  operationDate: dayjs(tableEntry.operationDate),
  operationType: tableEntry.operationType,
  tagIds: tableEntry.tagIds,
});
