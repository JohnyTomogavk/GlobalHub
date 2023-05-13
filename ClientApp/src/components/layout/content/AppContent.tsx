import React from 'react';
import styles from './AppContent.module.scss';
import { AppRouter } from '../../../router/AppRouter';
import { Breadcrumb } from 'antd';

const breadCrumpsItems = [
  {
    title: 'Budgets',
  },
  {
    title: <a href="">My Own Budget</a>,
  },
  {
    title: <a href="">Inner budget</a>,
  },
];

export const AppContent = (): JSX.Element => (
  <>
    <Breadcrumb items={breadCrumpsItems} className={styles.breadCrumps}></Breadcrumb>
    <div className={styles.pageContainer}>
      <AppRouter />
    </div>
  </>
);
