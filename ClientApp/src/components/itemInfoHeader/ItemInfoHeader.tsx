import { Header } from 'antd/es/layout/layout';
import { Affix, Breadcrumb, Button, Space, Spin, theme, Typography } from 'antd';
import React from 'react';
import styles from './itemInfoHeader.module.scss';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import ReactTimeAgo from 'react-time-ago';

const { Text } = Typography;

interface IItemInfoSubHeader {
  isLoading: boolean;
  itemTitle?: string;
  lastEdited?: Date;
  onDeleteCallback: () => void;
  breadCrumpsItems: ({ title: string } | { title: JSX.Element })[];
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
        <Breadcrumb items={props.breadCrumpsItems}></Breadcrumb>
        <Space>
          <Text className={styles.itemSaveStatus} type={'secondary'}>
            {props.isLoading ? (
              <Space>
                <Spin size={'small'} indicator={<LoadingOutlined spin />} />
                Saving
              </Space>
            ) : (
              <>
                <span>Edited </span>
                <ReactTimeAgo
                  date={props.lastEdited ? new Date(props.lastEdited) : new Date()}
                  timeStyle={'round-minute'}
                  locale={'en'}
                />
              </>
            )}
          </Text>
          <Button
            title={'Remove item'}
            onClick={props.onDeleteCallback}
            icon={<DeleteOutlined />}
            danger
            size={'small'}
          />
        </Space>
      </Header>
    </Affix>
  );
};
