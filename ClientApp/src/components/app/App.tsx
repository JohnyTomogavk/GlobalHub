import React from 'react';
import { Affix, Breadcrumb, Layout, theme } from 'antd';
import { AppFooter } from '../footer/Footer';
import AppHeader from '../header/Header';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideMenu } from '../sideMenu/SideMenu';
import styles from './App.module.scss';

const { Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider>
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
            <Content
              style={{
                margin: '0 16px',
              }}
            >
              <Breadcrumb
                items={[
                  {
                    title: 'Budgets',
                  },
                  {
                    title: <a href="">Application Center</a>,
                  },
                  {
                    title: <a href="">Application List</a>,
                  },
                  {
                    title: 'An Application',
                  },
                ]}
                style={{ margin: '16px 0' }}
              ></Breadcrumb>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                }}
              >
                {Array.from({ length: 100 }, (_, index) => (
                  <React.Fragment key={index}>
                    {index % 20 === 0 && index ? 'more' : '...'}
                    <br />
                  </React.Fragment>
                ))}
              </div>
              <AppFooter />
            </Content>
          </Layout>
        </Panel>
      </PanelGroup>
    </Layout>
  );
};

export default App;
