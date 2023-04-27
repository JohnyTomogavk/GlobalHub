import React from 'react';
import { Affix, Layout } from 'antd';
import { AppFooter } from '../footer/Footer';
import AppHeader from '../header/Header';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideMenu } from '../sideMenu/SideMenu';
import styles from './App.module.scss';
import { AppContent } from '../content/AppContent';

const { Content } = Layout;

const App: React.FC = () => (
  <Layout>
    <PanelGroup direction={'horizontal'}>
      <Panel minSize={15} maxSize={40} defaultSize={15}>
        <Affix offsetTop={0}>
          <SideMenu />
        </Affix>
      </Panel>
      <PanelResizeHandle className={styles.resizeHandle} />
      <Panel minSize={60} maxSize={90} defaultSize={85}>
        <Layout>
          <AppHeader />
          <Content className={styles.contentWrapper}>
            <AppContent />
            <AppFooter />
          </Content>
        </Layout>
      </Panel>
    </PanelGroup>
  </Layout>
);

export default App;
