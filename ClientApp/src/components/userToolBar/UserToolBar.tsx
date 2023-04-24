import type { MenuProps } from 'antd';
import { Avatar, Badge, Button, Dropdown, Popover } from 'antd';
import { BellOutlined, TranslationOutlined } from '@ant-design/icons';
import styles from './UserToolBar.module.scss';
import React from 'react';
import userIcon from '/assets/png1.png';
import NotificationPopover from '../notificationPopover/NotificationPopover';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <span>English</span>,
  },
  {
    key: '2',
    label: <span>Russian</span>,
  },
];

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

      <Dropdown
        trigger={['click']}
        arrow={true}
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: ['1'],
        }}
      >
        <Button type={'default'} icon={<TranslationOutlined />} />
      </Dropdown>

      <Avatar src={userIcon} shape={'square'} />
      <span className={styles.userName}>{userName}</span>
    </div>
  );
};

export default UserToolBar;
