import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import Button from 'antd/es/button';
import styles from './product.module.scss';
import { ArrowRightOutlined, CheckSquareTwoTone, DollarTwoTone, EditTwoTone } from '@ant-design/icons';
import { Image, TabsProps, Card, Tabs, theme } from 'antd/lib';
import Typography from 'antd/lib/typography';
import { AppFooter } from '../../components/layout/footer/Footer';
import { toNumber } from 'lodash';

const { Text, Title } = Typography;

interface TabItem {
  key: string;
  label: string;
  description: string;
  getIcon: (color: string) => ReactNode;
  tabContent: ReactNode;
  color: string;
}

export const ProductPage = (): JSX.Element => {
  const auth = useAuth();
  const [tabsActiveKey, setTabsActiveKey] = useState<string>('1');

  const onSignInClick = async (): Promise<void> => {
    await auth.signinRedirect();
  };

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const onTabTitleMouseEnter = (tabKey?: string): void => {
    if (tabKey && tabsActiveKey !== tabKey) {
      setTabsActiveKey(tabKey);
    }
  };

  const tabsItems: TabItem[] = [
    {
      key: '1',
      label: 'Budgets',
      description: 'Track your expenses and view detailed analytic on them',
      getIcon: (color) => <DollarTwoTone twoToneColor={color} />,
      color: 'red',
      tabContent: (
        <Image
          preview={false}
          src={
            'https://res.cloudinary.com/dtxbulhqd/image/upload/v1702236134/global-hub/product/jsbnysvyh76lguedxabm.png'
          }
        />
      ),
    },
    {
      key: '2',
      label: 'Notes',
      description: 'Write and document anything in simplest and fastest way',
      getIcon: (color) => <EditTwoTone twoToneColor={color} />,
      color: '#1677ff',
      tabContent: (
        <Image
          preview={false}
          src={
            'https://res.cloudinary.com/dtxbulhqd/image/upload/v1702236134/global-hub/product/bv92xvmfxullnb55bop5.png'
          }
        />
      ),
    },
    {
      key: '3',
      label: 'Tasks',
      description: 'Create tasks and operate them as you are comfortable to do that',
      getIcon: (color) => <CheckSquareTwoTone twoToneColor={color} />,
      color: 'orange',
      tabContent: (
        <Image
          preview={false}
          src={
            'https://res.cloudinary.com/dtxbulhqd/image/upload/v1702236134/global-hub/product/bv92xvmfxullnb55bop5.png'
          }
        />
      ),
    },
  ];

  const tabBarRenderer: TabsProps['renderTabBar'] = (): JSX.Element => (
    <div className={styles.tabBar}>
      {tabsItems.map((item) => (
        <Card
          key={item.key}
          onMouseEnter={() => onTabTitleMouseEnter(item.key)}
          style={{
            background: item.key === tabsActiveKey ? undefined : colorBgLayout,
          }}
          rootClassName={item.key === tabsActiveKey ? styles.cardActive : styles.tabCard}
          size={'small'}
          title={
            <Title level={3} className={styles.productTitle}>
              {item.getIcon(item.color)}
              &nbsp;
              {item.label}
            </Title>
          }
        >
          <Text>{item.description}</Text>
        </Card>
      ))}
    </div>
  );

  useEffect(() => {
    const tabSwitchInterval = 3000;

    setInterval(() => {
      setTabsActiveKey((prevState) => {
        const lastItemKey = tabsItems[tabsItems.length - 1].key;

        return prevState === lastItemKey ? tabsItems[0].key : `${toNumber(prevState) + 1}`;
      });
    }, tabSwitchInterval);
  }, []);

  return (
    <>
      <div className={styles.sectionsContainer}>
        <section className={styles.titlesSection}>
          <Title level={1} className={styles.productTitle}>
            Write, Track, Enrich...
          </Title>
          <Title level={3} className={styles.productTitle}>
            Build your life with Global Hub
          </Title>
          <Button type={'primary'} onClick={onSignInClick}>
            Get Global Hub for free
            <ArrowRightOutlined />
          </Button>
        </section>
        <section className={styles.tabsSection}>
          <img
            className={styles.productImage}
            src={
              'https://res.cloudinary.com/dtxbulhqd/image/upload/v1702236161/global-hub' +
              '/illustrations/rtoao9jyqq9lwmyw9cye.png'
            }
          />
          <Tabs
            defaultActiveKey="1"
            activeKey={tabsActiveKey}
            className={styles.tabsContainer}
            renderTabBar={tabBarRenderer}
            items={tabsItems.map((item) => ({
              key: item.key,
              label: item.label,
              children: <div className={styles.tabContentContainer}>{item.tabContent}</div>,
            }))}
          />
        </section>
      </div>
      <AppFooter />
    </>
  );
};
