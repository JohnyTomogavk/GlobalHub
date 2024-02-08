import { BudgetItemDrawerModel } from '../../budgetItem/budgetItemDrawer/budgetItemDrawerModel';

export interface BudgetItemDrawerConfig {
  title: string;
  isDrawerOpened: boolean;
  isFormDisabled?: boolean;
  initFormValues?: BudgetItemDrawerModel;
}
