import { Header } from 'antd/es/layout/layout';
import { Affix, Breadcrumb, Button, Space, theme, Tooltip, Typography } from 'antd';
import React from 'react';
import styles from './itemInfoHeader.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import ReactTimeAgo from 'react-time-ago';
import { BreadCrumbItem } from '../../models/breadCrumbs/breadCrumbItem';
import { Loader } from '../loader/Loader';

const { Text } = Typography;

interface IItemInfoSubHeader {
  isLoading: boolean;
  editedAt?: Date;
  createdAt: Date;
  onDeleteCallback: () => void;
  breadCrumbsItems: BreadCrumbItem[];
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
        <Breadcrumb items={props.breadCrumbsItems}></Breadcrumb>
        <Space size={'middle'}>
          <Tooltip
            placement={'bottom'}
            title={
              <Space direction={'vertical'}>
                <span>
                  Created&nbsp;
                  <ReactTimeAgo
                    date={new Date(props.createdAt)}
                    timeStyle={'round-minute'}
                    locale={'en'}
                    tooltip={false}
                  />
                </span>
                <span>
                  Updated&nbsp;
                  <ReactTimeAgo
                    date={new Date(props.editedAt ? props.editedAt : props.createdAt)}
                    timeStyle={'round-minute'}
                    locale={'en'}
                    tooltip={false}
                  />
                </span>
              </Space>
            }
          >
            <Text className={styles.itemSaveStatus} type={'secondary'}>
              {props.isLoading ? (
                <div className={styles.loaderSpacer}>
                  <Loader />
                  Saving
                </div>
              ) : (
                <>
                  <span>Edited </span>
                  <ReactTimeAgo
                    date={new Date(props.editedAt ? props.editedAt : props.createdAt)}
                    timeStyle={'round-minute'}
                    locale={'en'}
                    tooltip={false}
                  />
                </>
              )}
            </Text>
          </Tooltip>
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
