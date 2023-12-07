import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardComponent } from '../pages/dashboard/Dashboard';
import {
  BUDGET_ROUTE,
  DASHBOARD_ROUTE,
  NOT_FOUND_ROUTE,
  NOTE_LIST_ROUTE,
  NOTE_ROUTE,
  OPERATION_FAILED_ROUTE,
  REPORTS_ROUTE,
  TASK_ROUTE,
  WELCOME_PAGE_ROUTE,
} from '../constants/routingConstants';
import { TasksComponent } from '../pages/tasks/Tasks';
import { NotesComponent } from '../pages/notes/Notes';
import { BudgetComponent } from '../pages/budget/Budget';
import { NoteList } from '../pages/noteList/NoteList';
import { NotFound } from '../pages/notFound/NotFound';
import { OperationFailedComponent } from '../pages/operationFailed/OperationFailed';
import { WelcomePage } from '../pages/welcome/WelcomePage';
import { AppLayout } from '../components/app/AppLayout';

export const AppRouter = (): JSX.Element => (
  <Routes>
    <Route index path={WELCOME_PAGE_ROUTE} element={<WelcomePage />} />
    <Route path={'/'} element={<AppLayout />}>
      <Route index path={DASHBOARD_ROUTE} element={<DashboardComponent />} />
      <Route path={NOTE_LIST_ROUTE} element={<NoteList />} />
      <Route path={NOTE_ROUTE} element={<NotesComponent />} />
      <Route path={BUDGET_ROUTE} element={<BudgetComponent />} />
      <Route path={OPERATION_FAILED_ROUTE} element={<OperationFailedComponent />} />
      <Route path={NOT_FOUND_ROUTE} element={<NotFound />} />
      <Route path={TASK_ROUTE} element={<TasksComponent />} />
      <Route path={REPORTS_ROUTE} element={<DashboardComponent />} />
    </Route>
  </Routes>
);
