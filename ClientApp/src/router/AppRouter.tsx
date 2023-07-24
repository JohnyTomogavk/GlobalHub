import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardComponent } from '../pages/dashboard/Dashboard';
import {
  BUDGET_LIST_ROUTE,
  BUDGET_ROUTE,
  DASHBOARD_ROUTE,
  NOTE_LIST_ROUTE,
  NOTE_ROUTE,
  REPORTS_ROUTE,
  TASK_ROUTE,
} from '../constants/routingConstants';
import { TasksComponent } from '../pages/tasks/Tasks';
import { NotesComponent } from '../pages/notes/Notes';
import { BudgetComponent } from '../pages/budget/Budget';
import { NoteList } from '../pages/noteList/noteList';

export const AppRouter = (): JSX.Element => (
  <Routes>
    <Route path="*" element={<DashboardComponent />} />
    <Route path={DASHBOARD_ROUTE} element={<DashboardComponent />} />
    <Route path={TASK_ROUTE} element={<TasksComponent />} />
    <Route path={NOTE_LIST_ROUTE} element={<NoteList />} />
    <Route path={NOTE_ROUTE} element={<NotesComponent />} />
    <Route path={BUDGET_ROUTE} element={<BudgetComponent />} />
    <Route path={BUDGET_LIST_ROUTE} element={<BudgetComponent />} />
    <Route path={REPORTS_ROUTE} element={<DashboardComponent />} />
  </Routes>
);
