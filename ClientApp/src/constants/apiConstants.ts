// TODO: Extract to environment variables
export const NOTES_API_BASE = 'http://localhost:5143/api/v1';
export const BUDGETS_API_BASE = 'http://localhost:5118/api/v1';

// Constants related to notes
export const CREATE_NOTE = '/Notes/CreateNote';
export const GET_NOTE_BY_ID = '/Notes/GetNoteById';
export const UPDATE_NOTE_TITLE = '/Notes/UpdateNoteTitle';
export const UPDATE_NOTE_CONTENT = '/Notes/UpdateNoteContent';
export const GET_NOTES_MAP = '/Notes/GetNoteMap';
export const GET_NOTES_LIST = '/Notes/GetNoteList';
export const DELETE_NOTE = '/Notes/DeleteNote';

// Constants related to budgets
export const GET_BUDGETS_MAP = '/Budget/GetBudgetsMap';
export const GET_BUDGET_BY_ID = '/Budget/GetBudgetById';
export const CREATE_BUDGET = '/Budget/CreateNewBudget';
export const GET_BUDGETS_ANALYTIC_FOR_CURRENT_MONTH = '/Budget/GetBudgetAnalyticForCurrentMonth';
export const DELETE_BUDGET_BY_ID = '/Budget/DeleteBudgetById';
export const UPDATE_BUDGET_TITLE = '/Budget/UpdateBudgetTitle';
export const UPDATE_BUDGET_DESCRIPTION = '/Budget/UpdateBudgetDescription';
export const UPDATE_BUDGET_PRESERVE_PERCENT = '/Budget/UpdateBudgetPreservePercent';

// Constants related to budget items
export const GET_BUDGET_ITEMS_BY_BUDGET_ID = '/BudgetItem/GetBudgetItemsByBudgetId';
export const CREATE_BUDGET_ITEM = '/BudgetItem/CreateBudgetItem';
export const UPDATE_BUDGET_ITEM = '/BudgetItem/UpdateBudgetItem';
export const DELETE_BUDGET_ITEM_BY_ID = '/BudgetItem/DeleteBudgetItem';

// Constants related to tags
export const GET_BUDGET_TAGS_BY_ID = '/Tag/GetBudgetTagsByBudgetId';
export const CREATE_TAG = '/Tag/CreateNewTag';
export const UPDATE_TAG = '/Tag/UpdateTag';
export const DELETE_TAG = '/Tag/DeleteTag';
