import { Header } from 'antd/es/layout/layout';
import { Affix, Breadcrumb, Space, Spin, theme, Typography } from 'antd';
import React from 'react';
import styles from './itemInfoHeader.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import ReactTimeAgo from 'react-time-ago';
import { NOTE_TITLE_PLACEHOLDER } from '../../constants/notesConstants';

const { Text } = Typography;

interface IItemInfoSubHeader {
  isLoading: boolean;
  itemTitle?: string;
  setNoteTitle: (chagnedTitle: string) => void;
  lastEdited?: Date;
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
        <Text
          editable={{
            triggerType: ['text', 'icon'],
            text: props.itemTitle,
            onChange: (changedTitle: string) => props.setNoteTitle(changedTitle),
            autoSize: {
              minRows: 1,
              maxRows: 1,
            },
            tooltip: props.itemTitle,
          }}
          ellipsis
          strong
          className={styles.itemTitle}
          inputMode={'text'}
          placeholder={NOTE_TITLE_PLACEHOLDER}
        >
          {props.itemTitle}
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
              <ReactTimeAgo
                date={props.lastEdited ? new Date(props.lastEdited) : new Date()}
                timeStyle={'round-minute'}
                locale={'en'}
              />
            </>
          )}
        </Text>
      </Header>
    </Affix>
  );
};
