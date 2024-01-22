export enum BudgetItemRegularityType {
  Unknown = 0,
  Regular = 1,
  Irregular,
}

export const BudgetItemRegularityTypeTitle = {
  [BudgetItemRegularityType.Unknown]: 'Unknown',
  [BudgetItemRegularityType.Regular]: 'Regular',
  [BudgetItemRegularityType.Irregular]: 'Irregular',
};
