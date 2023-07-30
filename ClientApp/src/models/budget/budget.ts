import { IHasDate } from '../../interfaces/IHasDate';

export interface Budget extends IHasDate {
  id: number;
  budgeTitle: string;
  budgetDescription: string;

  // TODO: Add budget items array
}
