import React from 'react';
import { Header } from 'antd/es/layout/layout';
import { AutoComplete, Input, theme } from 'antd';
import UserToolBar from '../userToolBar/UserToolBar';
import styles from './Header.module.scss';
import { useTranslation } from 'react-i18next';

const AppHeader = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        background: colorBgContainer,
      }}
      className={styles.headerWrapper}
    >
      <AutoComplete className={styles.autocomplete} popupMatchSelectWidth={500} options={[]}>
        <Input.Search size="middle" placeholder={t('HEADER.SEARCH_PANEL.TYPE_HERE').toString()} />
      </AutoComplete>
      <UserToolBar />
    </Header>
  );
};

export default AppHeader;
