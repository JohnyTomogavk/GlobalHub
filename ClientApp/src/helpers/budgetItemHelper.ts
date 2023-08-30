import { BudgetItemTableEntry } from '../models/budgetItem/budgetItemsTable/budgetItemsTableEntry';
import { BudgetItemDrawerModel } from '../models/budgetItem/budgetItemDrawer/budgetItemDrawerModel';
import dayjs from 'dayjs';
import { BudgetItemCreateDto } from '../dto/budgetItems/budgetItemCreateDto';
import { BudgetItemRegularityType } from '../enums/budgetItemRegularityType';
import { BudgetItemDto } from '../dto/budgets/budgetItemDto';
import { BudgetItemUpdateDto } from '../dto/budgetItems/budgetItemUpdateDto';

export const budgetItemTableEntryToDrawerModel = (tableEntry: BudgetItemTableEntry): BudgetItemDrawerModel => ({
  budgetItemId: tableEntry.key,
  title: tableEntry.title,
  description: tableEntry.description,
  operationCost: tableEntry.operationCost,
  operationDate: dayjs(tableEntry.operationDate),
  operationType: tableEntry.operationType,
  tagIds: tableEntry.tagIds,
});

export const drawerModelToBudgetItemCreateDto = (
  drawerModel: BudgetItemDrawerModel,
  budgetId: number
): BudgetItemCreateDto => ({
  budgetId: budgetId,
  itemTitle: drawerModel.title,
  itemDescription: drawerModel.description,
  budgetItemOperationType: drawerModel.operationType,
  budgetItemRegularityType: BudgetItemRegularityType.Irregular,
  budgetOperationCost: drawerModel.operationCost,
  paymentDate: drawerModel.operationDate.toDate(),
  tagIds: drawerModel.tagIds,
});

export const drawerModelToBudgetItemUpdateDto = (
  drawerModel: BudgetItemDrawerModel,
  budgetId: number,
  budgetItemId: number
): BudgetItemUpdateDto => ({
  id: budgetItemId,
  budgetId: budgetId,
  itemTitle: drawerModel.title,
  itemDescription: drawerModel.description,
  budgetItemOperationType: drawerModel.operationType,
  budgetItemRegularityType: BudgetItemRegularityType.Irregular,
  budgetOperationCost: drawerModel.operationCost,
  paymentDate: drawerModel.operationDate.toDate(),
  tagIds: drawerModel.tagIds,
});

export const budgetItemDtoToTableEntry = (budgetItemDto: BudgetItemDto): BudgetItemTableEntry => ({
  key: budgetItemDto.id,
  title: budgetItemDto.itemTitle,
  description: budgetItemDto.itemDescription,
  operationType: budgetItemDto.budgetItemOperationType,
  operationCost: budgetItemDto.budgetOperationCost.toFixed(1).toString(),
  tagIds: budgetItemDto.tagIds,
  operationDate: new Date(budgetItemDto.paymentDate),
});
