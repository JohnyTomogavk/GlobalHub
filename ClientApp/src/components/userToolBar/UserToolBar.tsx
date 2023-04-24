import { Avatar, Badge, Button, Popover, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import styles from './UserToolBar.module.scss';
import React from 'react';
import { NotificationPopover } from '../notificationPopover/NotificationPopover';
import userIcon from '/assets/png1.png';

const UserToolBar = (): JSX.Element => {
  const userName = 'Johny Tomogavk';

  return (
    <div className={styles.headerToolbar}>
      <Popover
        title={<span>Notifications</span>}
        content={<NotificationPopover />}
        trigger="click"
        overlayStyle={{
          width: '400px',
          height: '10rem',
        }}
        placement="bottomLeft"
      >
        <Badge size={'small'} count={4}>
          <Button icon={<BellOutlined />}></Button>
        </Badge>
      </Popover>
      <Space>
        <Avatar src={userIcon} shape={'square'} />
        <span className={styles.userName}>{userName}</span>
      </Space>
    </div>
  );
};

export default UserToolBar;
