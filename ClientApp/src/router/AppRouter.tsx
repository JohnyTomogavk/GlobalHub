import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardComponent } from '../pages/dashboard/Dashboard';
import {
  BUDGET_PAGE,
  DASHBOARD_PAGE,
  NOTE_PAGE,
  TASK_PAGE,
} from '../constants/routingConstants';
import { TasksComponent } from '../pages/tasks/Tasks';
import { NotesComponent } from '../pages/notes/Notes';
import { BudgetComponent } from '../pages/budget/Budget';

export const AppRouter = (): JSX.Element => (
  <Routes>
    <Route path="*" element={<DashboardComponent />} />
    <Route path={DASHBOARD_PAGE} element={<DashboardComponent />} />
    <Route path={TASK_PAGE} element={<TasksComponent />} />
    <Route path={NOTE_PAGE} element={<NotesComponent />} />
    <Route path={BUDGET_PAGE} element={<BudgetComponent />} />
  </Routes>
);
