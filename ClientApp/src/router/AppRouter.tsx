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
} from '../constants/routingConstants';
import { TasksComponent } from '../pages/tasks/Tasks';
import { NotesComponent } from '../pages/notes/Notes';
import { BudgetComponent } from '../pages/budget/Budget';
import { NoteList } from '../pages/noteList/NoteList';
import { NotFound } from '../pages/notFound/NotFound';
import { OperationFailedComponent } from '../pages/operationFailed/OperationFailed';
import GuardedComponent from './guard/GuardedComponent';

export const AppRouter = (): JSX.Element => (
  <Routes>
    <Route index path={DASHBOARD_ROUTE} element={<DashboardComponent />} />
    <Route path={TASK_ROUTE} element={<TasksComponent />} />
    <Route
      path={NOTE_LIST_ROUTE}
      element={
        <GuardedComponent>
          <NoteList />
        </GuardedComponent>
      }
    />
    <Route
      path={NOTE_ROUTE}
      element={
        <GuardedComponent>
          <NotesComponent />
        </GuardedComponent>
      }
    />
    <Route
      path={BUDGET_ROUTE}
      element={
        <GuardedComponent>
          <BudgetComponent />
        </GuardedComponent>
      }
    />
    <Route path={REPORTS_ROUTE} element={<DashboardComponent />} />
    <Route
      path={OPERATION_FAILED_ROUTE}
      element={
        <GuardedComponent>
          <OperationFailedComponent />
        </GuardedComponent>
      }
    />
    <Route
      path={NOT_FOUND_ROUTE}
      element={
        <GuardedComponent>
          <NotFound />
        </GuardedComponent>
      }
    />
  </Routes>
);
