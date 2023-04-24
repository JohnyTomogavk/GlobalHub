import React from 'react';
import { Header } from 'antd/es/layout/layout';
import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import UserToolBar from '../userToolBar/UserToolBar';
import styles from './Header.module.scss';

const renderTitle = (title: string) => (
  <span>
    {title}
    <a
      style={{ float: 'right' }}
      href="https://www.google.com/search?q=antd"
      target="_blank"
      rel="noopener noreferrer"
    >
      more
    </a>
  </span>
);

const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {title}
      <span>
        <UserOutlined /> {count}
      </span>
    </div>
  ),
});

const options = [
  {
    label: renderTitle('Libraries'),
    options: [
      renderItem('AntDesign', 10000),
      renderItem('AntDesign UI', 10600),
    ],
  },
  {
    label: renderTitle('Solutions'),
    options: [
      renderItem('AntDesign UI FAQ', 60100),
      renderItem('AntDesign FAQ', 30010),
    ],
  },
  {
    label: renderTitle('Articles'),
    options: [renderItem('AntDesign design language', 100000)],
  },
];

const AppHeader = (): JSX.Element => {
  return (
    <Header className={styles.headerWrapper}>
      <AutoComplete
        className={styles.autocomplete}
        dropdownMatchSelectWidth={500}
        options={options}
      >
        <Input.Search size="middle" placeholder="Type here" />
      </AutoComplete>
      <UserToolBar />
    </Header>
  );
};

export default AppHeader;
