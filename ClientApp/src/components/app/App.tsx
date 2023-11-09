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
import { useNavigate } from 'react-router-dom';
import { setUpAxiosExceptionInterceptor } from '../../config/axiosExceptionInterceptor';
import { initLocales } from '../../config/localizationConfigurator';
import { createGlobalStyle } from 'styled-components';

const { Content } = Layout;

const ThemeStyleProvider = createGlobalStyle<{ $isDarkTheme: boolean }>`
  html {
    color-scheme: ${(props): string => (props.$isDarkTheme ? 'dark' : 'light')};
  }
`;

export const App = observer(() => {
  const { isDarkTheme, currentLanguage } = CommonStore;
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    setIsLoaded(true);
    setUpAxiosExceptionInterceptor(navigate);
    initLocales(currentLanguage);
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
        token: {
          borderRadius: 0,
        },
      }}
    >
      <Layout>
        <ThemeStyleProvider $isDarkTheme={isDarkTheme} />
        <PanelGroup direction={'horizontal'} autoSaveId={'layout-panels-state'} disablePointerEventsDuringResize={true}>
          <Panel minSize={12} maxSize={40} defaultSize={12}>
            <Affix offsetTop={0}>
              <SideMenu />
            </Affix>
          </Panel>
          <PanelResizeHandle className={styles.resizeHandle} />
          <Panel minSize={60} maxSize={88} defaultSize={88}>
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
    </ConfigProvider>
  );
});
