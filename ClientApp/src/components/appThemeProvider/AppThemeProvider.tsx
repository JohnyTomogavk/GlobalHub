import { ConfigProvider, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import uiConfigStore from '../../store/uiConfigStore';
import React from 'react';

export const AppThemeProvider = observer(({ children }: { children: JSX.Element }): JSX.Element => {
  const { isDarkTheme } = uiConfigStore;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
        token: {
          borderRadius: 3,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
});
