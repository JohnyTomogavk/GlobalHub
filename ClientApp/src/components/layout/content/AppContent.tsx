import React from 'react';
import styles from './AppContent.module.scss';
import { AppRouter } from '../../../router/AppRouter';

export const AppContent = (): JSX.Element => (
  <div className={styles.pageContainer}>
    <AppRouter />
  </div>
);
