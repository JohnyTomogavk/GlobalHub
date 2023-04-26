import React from 'react';
import { Affix, Breadcrumb, Layout } from 'antd';
import { AppFooter } from '../footer/Footer';
import AppHeader from '../header/Header';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideMenu } from '../sideMenu/SideMenu';
import styles from './App.module.scss';
import Title from 'antd/es/typography/Title';

const { Content } = Layout;

const App: React.FC = () => {
  return (
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
                className={styles.breadCrumps}
              ></Breadcrumb>
              <div className={styles.contentContainer}>
                <Title level={2}>New topic</Title>
                {Array.from({ length: 100 }, (_, index) => (
                  <React.Fragment key={index}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    At, nulla, veniam. Amet aspernatur atque cupiditate magni
                    necessitatibus placeat repellendus sunt! br
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
