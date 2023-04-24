import React from 'react';
import { Header } from 'antd/es/layout/layout';
import { AutoComplete, Input } from 'antd';
import UserToolBar from '../userToolBar/UserToolBar';
import styles from './Header.module.scss';

const AppHeader = (): JSX.Element => (
  <Header className={styles.headerWrapper}>
    <AutoComplete
      className={styles.autocomplete}
      dropdownMatchSelectWidth={500}
      options={[]}
    >
      <Input.Search size="middle" placeholder="Type here" />
    </AutoComplete>
    <UserToolBar />
  </Header>
);

export default AppHeader;
