import React from 'react';
import { Affix, ConfigProvider, Layout, theme } from 'antd';
import { AppFooter } from '../layout/footer/Footer';
import AppHeader from '../layout/header/Header';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideMenu } from '../layout/sideMenu/SideMenu';
import styles from './App.module.scss';
import { AppContent } from '../layout/content/AppContent';
import CommonStore from '../../store/commonStore';
import { observer } from 'mobx-react-lite';

const { Content } = Layout;

export const App = observer(() => {
  const { isDarkTheme } = CommonStore;

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
        <PanelGroup direction={'horizontal'}>
          <Panel minSize={15} maxSize={40} defaultSize={15}>
            <Affix offsetTop={0}>
              <SideMenu />
            </Affix>
          </Panel>
          <PanelResizeHandle className={styles.resizeHandle} />
          <Panel minSize={60} maxSize={90} defaultSize={85}>
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
