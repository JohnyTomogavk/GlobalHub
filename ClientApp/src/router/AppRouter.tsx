import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardComponent } from '../pages/dashboard/Dashboard';
import {
  BUDGET_LIST_ROUTE,
  BUDGET_ROUTE,
  DASHBOARD_ROUTE,
  NOT_FOUND_ROUTE,
  NOTE_LIST_ROUTE,
  NOTE_ROUTE,
  OPERATION_FAILED_ROUTE,
  REPORTS_ROUTE,
  TASK_ROUTE,
} from '../constants/routingConstants';
import { TasksComponent } from '../pages/tasks/Tasks';
import { NotesComponent } from '../pages/notes/Notes';
import { BudgetComponent } from '../pages/budget/Budget';
import { NoteList } from '../pages/noteList/noteList';
import { BudgetListComponent } from '../pages/budgetList/BudgetList';
import { NotFound } from '../pages/notFound/NotFound';
import { OperationFailedComponent } from '../pages/operationFailed/OperationFailed';

export const AppRouter = (): JSX.Element => (
  <Routes>
    <Route index path={DASHBOARD_ROUTE} element={<DashboardComponent />} />
    <Route path={TASK_ROUTE} element={<TasksComponent />} />
    <Route path={NOTE_LIST_ROUTE} element={<NoteList />} />
    <Route path={NOTE_ROUTE} element={<NotesComponent />} />
    <Route path={BUDGET_ROUTE} element={<BudgetComponent />} />
    <Route path={BUDGET_LIST_ROUTE} element={<BudgetListComponent />} />
    <Route path={REPORTS_ROUTE} element={<DashboardComponent />} />
    <Route path={OPERATION_FAILED_ROUTE} element={<OperationFailedComponent />} />
    <Route path={NOT_FOUND_ROUTE} element={<NotFound />} />
  </Routes>
);
