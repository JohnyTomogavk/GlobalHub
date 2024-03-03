import React, { ReactNode, useEffect, useRef } from 'react';
import { Badge, List } from 'antd';
import styles from './NotificationPopover.module.scss';
import { NotificationModel } from '../../../models/notifications/notificationModel';
import { useInViewport } from 'ahooks';

interface INotificationPopoverProps {
  notifications: NotificationModel[];
  onNotificationViewedConnection: (notificationId: string) => void;
}

const NotificationItem = ({
  id,
  icon,
  message,
  description,
  hasBeenViewed,
  onViewedCallback,
}: {
  id: string;
  icon: ReactNode;
  message: ReactNode;
  description: ReactNode;
  hasBeenViewed: boolean;
  onViewedCallback?: (notificationId: string) => void;
}): JSX.Element => {
  const listItemRef = useRef<HTMLElement | null>(null);

  const [isInViewport] = useInViewport(listItemRef, {
    threshold: 0.9,
    root: () => document.getElementById('notificationsPopoverRoot'),
  });

  useEffect(() => {
    if (!isInViewport || !onViewedCallback) {
      return;
    }

    onViewedCallback(id);
  }, [isInViewport]);

  return (
    <List.Item ref={listItemRef} key={id}>
      <List.Item.Meta avatar={<Badge dot={!hasBeenViewed}>{icon}</Badge>} title={message} description={description} />
    </List.Item>
  );
};

const NotificationPopover = ({
  notifications,
  onNotificationViewedConnection,
}: INotificationPopoverProps): JSX.Element => (
  <List
    className={styles.notificationListContent}
    itemLayout="horizontal"
    dataSource={notifications}
    size={'default'}
    id={'notificationsPopoverRoot'}
  >
    {notifications.length !== 0 &&
      notifications.map((item) => (
        <NotificationItem
          key={item.id}
          id={item.id}
          icon={item.icon}
          description={item.description}
          message={item.message}
          hasBeenViewed={item.hasBeenViewed}
          onViewedCallback={!item.hasBeenViewed ? onNotificationViewedConnection : undefined}
        />
      ))}
  </List>
);

export default NotificationPopover;
