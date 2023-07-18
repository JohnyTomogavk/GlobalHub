import React from 'react';
import styles from './AppContent.module.scss';
import { AppRouter } from '../../../router/AppRouter';
import { theme } from 'antd';

export const AppContent = (): JSX.Element => {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  return (
    <div
      style={{
        background: colorBgBase,
      }}
      className={styles.pageContainer}
    >
      <AppRouter />
    </div>
  );
};
