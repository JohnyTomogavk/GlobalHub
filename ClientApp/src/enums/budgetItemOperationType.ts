export enum BudgetItemOperationType {
  Unknown = 0,
  Incoming = 1,
  Outgoing,
}

export const BudgetItemOperationTypeTitle = {
  [BudgetItemOperationType.Unknown]: 'Unknown',
  [BudgetItemOperationType.Incoming]: 'Incoming',
  [BudgetItemOperationType.Outgoing]: 'Outgoing',
};
