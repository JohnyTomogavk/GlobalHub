import React from 'react';
import { Breadcrumb } from 'antd';
import styles from './AppContent.module.scss';
import { AppRouter } from '../../router/AppRouter';

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
    <Breadcrumb
      items={breadCrumpsItems}
      className={styles.breadCrumps}
    ></Breadcrumb>
    <div className={styles.contentContainer}>
      <AppRouter />
    </div>
  </>
);
