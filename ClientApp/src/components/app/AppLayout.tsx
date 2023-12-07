import React, { useState } from 'react';
import { Affix, ConfigProvider, Layout, theme } from 'antd';
import { AppFooter } from '../layout/footer/Footer';
import AppHeader from '../layout/header/Header';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideMenu } from '../layout/sideMenu/SideMenu';
import styles from './App.module.scss';
import '../../config/localizationConfigurator';
import CommonStore from '../../store/uiConfigStore';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle } from 'styled-components';
import { initLocales } from '../../config/localizationConfigurator';
import AuthGuardComponent from '../../router/guard/AuthGuardComponent';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const ThemeStyleProvider = createGlobalStyle<{ $isDarkTheme: boolean }>`
  html {
    color-scheme: ${(props): string => (props.$isDarkTheme ? 'dark' : 'light')};
  }
`;

export const AppLayout = observer(() => {
  const { isDarkTheme, currentLanguage } = CommonStore;
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    initLocales(currentLanguage);
    setIsLoaded(true);
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
        token: {
          borderRadius: 2,
        },
      }}
    >
      <Layout>
        <ThemeStyleProvider $isDarkTheme={isDarkTheme} />
        <AuthGuardComponent>
          <PanelGroup direction={'horizontal'} autoSaveId={'layout-panels-state'}>
            <Panel minSizePercentage={10} maxSizePercentage={30} defaultSizePercentage={15}>
              <Affix offsetTop={1}>
                <SideMenu />
              </Affix>
            </Panel>
            <PanelResizeHandle className={styles.resizeHandle} />
            <Panel minSizePercentage={70} maxSizePercentage={90} defaultSizePercentage={85}>
              <AppHeader />
              <Layout>
                <Content className={styles.pageContent}>
                  <Outlet />
                </Content>
                <AppFooter />
              </Layout>
            </Panel>
          </PanelGroup>
        </AuthGuardComponent>
      </Layout>
    </ConfigProvider>
  );
});