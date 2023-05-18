import { Header } from 'antd/es/layout/layout';
import { Affix, Breadcrumb, Space, Spin, theme, Typography } from 'antd';
import React from 'react';
import styles from './itemInfoHeader.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import ReactTimeAgo from 'react-time-ago';

const { Text } = Typography;

const breadCrumbsItems = [
  {
    title: 'Budgets',
  },
  {
    title: <a href="">My Own Budget</a>,
  },
  {
    title: <a href="">Inner budget</a>,
  },
];

interface IItemInfoSubHeader {
  isLoading?: boolean;
  lastEdited?: Date;
  breadCrumpsItems?: { title: string }[];
}

export const ItemInfoSubHeader = (props: IItemInfoSubHeader): JSX.Element => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Affix offsetTop={0}>
      <Header
        className={styles.itemsContainer}
        style={{
          background: colorBgContainer,
        }}
      >
        <Breadcrumb items={breadCrumbsItems}></Breadcrumb>
        <Text
          editable={{ triggerType: ['text', 'icon'] }}
          strong
          className={styles.itemTitle}
          inputMode={'text'}
          placeholder={'Untitled'}
        >
          Note 1: Some notes just for example
        </Text>
        <Text className={styles.itemSaveStatus} type={'secondary'}>
          {props.isLoading ? (
            <Space>
              <Spin size={'small'} indicator={<LoadingOutlined spin />} />
              Saving
            </Space>
          ) : (
            <>
              <span>Edited </span>
              <ReactTimeAgo date={new Date()} timeStyle={'round-minute'} locale={'en'} />
            </>
          )}
        </Text>
      </Header>
    </Affix>
  );
};
