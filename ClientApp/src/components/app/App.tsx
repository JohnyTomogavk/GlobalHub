import React, { useState } from 'react';
import { Affix, ConfigProvider, Layout, theme } from 'antd';
import { AppFooter } from '../layout/footer/Footer';
import AppHeader from '../layout/header/Header';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideMenu } from '../layout/sideMenu/SideMenu';
import styles from './App.module.scss';
import { AppContent } from '../layout/content/AppContent';
import '../../config/localizationConfigurator';
import CommonStore from '../../store/uiConfigStore';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle } from 'styled-components';
import { initLocales } from '../../config/localizationConfigurator';
import GuardedComponent from '../../router/guard/GuardedComponent';

const { Content } = Layout;

const ThemeStyleProvider = createGlobalStyle<{ $isDarkTheme: boolean }>`
  html {
    color-scheme: ${(props): string => (props.$isDarkTheme ? 'dark' : 'light')};
  }
`;

export const App = observer(() => {
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
      <GuardedComponent>
        <Layout>
          <ThemeStyleProvider $isDarkTheme={isDarkTheme} />
          <PanelGroup direction={'horizontal'} autoSaveId={'layout-panels-state'}>
            <Panel minSizePercentage={10} maxSizePercentage={30} defaultSizePercentage={15}>
              <Affix offsetTop={0}>
                <SideMenu />
              </Affix>
            </Panel>
            <PanelResizeHandle className={styles.resizeHandle} />
            <Panel minSizePercentage={70} maxSizePercentage={90} defaultSizePercentage={85}>
              <AppHeader />
              <Layout>
                <Content>
                  <AppContent />
                </Content>
                <AppFooter />
              </Layout>
            </Panel>
          </PanelGroup>
        </Layout>
      </GuardedComponent>
    </ConfigProvider>
  );
});
