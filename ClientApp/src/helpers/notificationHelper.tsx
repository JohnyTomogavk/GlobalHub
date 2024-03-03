import { NotificationBase } from '../entities/notifications/notificationBase';
import { ArgsProps } from 'antd/es/notification/interface';
import { EEventType } from '../enums/notifications/EEventType';
import React, { ReactNode } from 'react';
import { OnEventStartedNotification } from '../entities/notifications/onEventStartedNotification';
import { Flex, Typography } from 'antd';
import { BellOutlined, CalendarOutlined, FieldTimeOutlined, QuestionOutlined } from '@ant-design/icons';
import { BeforeEventStartedNotification } from '../entities/notifications/beforeEventStartedNotification';
import { BeforeTaskDueDateNotification } from '../entities/notifications/beforeTaskDueDateNotification';
import { capitalize } from 'lodash';
import ReactTimeAgo from 'react-time-ago';

const { Text } = Typography;

type INotificationConfig = ArgsProps;

const eventTypeToNotificationDescriptionMapping = {
  [EEventType.Unknown]: '',
  [EEventType.BeforeEventStarted]: 'Event is about to start',
  [EEventType.OnEventStarted]: 'Event started',
  [EEventType.BeforeTaskDueDate]: 'Task due date reminder',
};

const eventTypeToNotificationIcon = {
  [EEventType.Unknown]: <QuestionOutlined />,
  [EEventType.BeforeEventStarted]: <CalendarOutlined />,
  [EEventType.OnEventStarted]: <BellOutlined />,
  [EEventType.BeforeTaskDueDate]: <FieldTimeOutlined />,
};

const getDescriptionRetriever = (notification: NotificationBase, makeTitlesLinked: boolean): (() => ReactNode) => {
  let func: () => ReactNode;

  switch (notification.eventType) {
    case EEventType.Unknown:
      func = (): ReactNode => <></>;
      break;
    case EEventType.OnEventStarted:
      func = (): ReactNode => {
        const concreteNotification = notification as OnEventStartedNotification;

        return (
          <Text>
            <Text strong>{capitalize(concreteNotification.projectItemTitle)}</Text> in&nbsp;
            <Text strong>{concreteNotification.projectTitle}</Text> has been started.
          </Text>
        );
      };
      break;
    case EEventType.BeforeEventStarted:
      func = (): ReactNode => {
        const concreteNotification = notification as BeforeEventStartedNotification;

        return (
          <Text>
            <Text strong>{capitalize(concreteNotification.projectItemTitle)}</Text> in&nbsp;
            <Text strong>{concreteNotification.projectTitle}</Text> is about to start.
          </Text>
        );
      };
      break;
    case EEventType.BeforeTaskDueDate:
      func = (): ReactNode => {
        const concreteNotification = notification as BeforeTaskDueDateNotification;

        return (
          <Text>
            <Text strong>{capitalize(concreteNotification.projectItemTitle)}</Text> in&nbsp;
            <Text strong>{concreteNotification.projectTitle}</Text> is about to reach due date -&nbsp;
            {concreteNotification.dueDate.toString()}
          </Text>
        );
      };
      break;
  }

  return func;
};

export const getNotificationConfig = (
  notification: NotificationBase,
  makeTitlesLinked: boolean
): INotificationConfig => {
  const message = (
    <Flex justify={'space-between'}>
      {eventTypeToNotificationDescriptionMapping[notification.eventType]}
      <Text type={'secondary'}>
        <ReactTimeAgo
          date={new Date(notification.dateReceived)}
          timeStyle={'round-minute'}
          locale={'en'}
          style={{
            fontWeight: 'initial',
          }}
        />
      </Text>
    </Flex>
  );
  const description = getDescriptionRetriever(notification, makeTitlesLinked)();
  const icon = eventTypeToNotificationIcon[notification.eventType];

  return {
    message: message,
    description: description,
    icon: icon,
    duration: 120,
  };
};
