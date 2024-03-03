import { App, Badge, Button, Dropdown, Popover, Typography } from 'antd';
import { BellOutlined, FormatPainterOutlined, TranslationOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import NotificationPopover from '../notificationPopover/NotificationPopover';
import { EN, RU } from '../../../constants/languagesConstants';
import { useTranslation } from 'react-i18next';
import { i18n as i18n_type } from 'i18next';
import { antdMenuItem } from '../../../models/shared/antdMenuItem';
import CommonStore from '../../../store/uiConfigStore';
import { observer } from 'mobx-react-lite';
import styles from './UserToolBar.module.scss';
import { useAuth } from 'react-oidc-context';
import {
  MAKE_NOTIFICATION_AS_VIEWED_NAME,
  NOTIFICATION_RECEIVED_METHOD_NAME,
} from '../../../constants/notificationHubConstants';
import useNotificationsHubConnection from '../../../hooks/hubs/useNotificationsHubConnection';
import { NotificationBase } from '../../../entities/notifications/notificationBase';
import { getNotificationConfig } from '../../../helpers/notificationHelper';
import { NotificationModel } from '../../../models/notifications/notificationModel';
import useNotificationsApi from '../../../hooks/api/useNotificationsApi';
import { HttpStatusCode } from 'axios';

const { Text } = Typography;

const UserToolBar = observer((): JSX.Element => {
  const { i18n } = useTranslation();
  const { t } = i18n;
  const { currentLanguage, setLanguage, isDarkTheme, toggleTheme } = CommonStore;
  const auth = useAuth();
  const { notificationHub } = useNotificationsHubConnection();
  const { notification } = App.useApp();
  const notificationsApi = useNotificationsApi();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const uncheckedNotificationsCount = notifications.filter(
    (notificationModel: NotificationModel) => !notificationModel.hasBeenViewed
  ).length;

  const onNotificationViewedConnection = async (id: string): Promise<void> => {
    if (notificationHub === null) return;

    await notificationHub.send(MAKE_NOTIFICATION_AS_VIEWED_NAME, id);
    setNotifications((prevState) =>
      prevState.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            hasBeenViewed: true,
          };
        }

        return item;
      })
    );
  };

  const fetchUsersNotifications = async (): Promise<void> => {
    const { status, data } = await notificationsApi.getUserNotifications();

    if (status === HttpStatusCode.Ok) {
      const notificationModels = data
        .map(
          (item) =>
            ({
              ...getNotificationConfig(item, true),
              id: item.id,
              hasBeenViewed: item.hasBeenViewed,
              receivedDate: item.dateReceived,
            }) as NotificationModel
        )
        .reverse();

      setNotifications(notificationModels);
    }
  };

  useEffect(() => {
    fetchUsersNotifications();
  }, []);

  useEffect(() => {
    if (notificationHub === null) return;

    notificationHub.on(NOTIFICATION_RECEIVED_METHOD_NAME, (receivedNotification: NotificationBase) => {
      const config = getNotificationConfig(receivedNotification, false);
      setNotifications((prevState) => [
        {
          id: receivedNotification.id,
          message: config.message,
          description: config.description,
          icon: config.icon,
          receivedDate: receivedNotification.dateReceived,
          hasBeenViewed: receivedNotification.hasBeenViewed,
        } as NotificationModel,
        ...prevState,
      ]);
      notification.info(config);
    });
  }, [notificationHub, notification]);

  const onLanguageSelect = (i18: i18n_type, selectedLanguage: string): void => {
    setLanguage(selectedLanguage);
    i18.changeLanguage(selectedLanguage).then();
  };

  const languages: antdMenuItem[] = [
    {
      label: t('HEADER.LANGUAGES.LANGUAGE'),
      type: 'group',
      children: [
        {
          key: EN,
          label: <span>{t('HEADER.LANGUAGES.ENGLISH')}</span>,
        },
        {
          key: RU,
          label: <span>{t('HEADER.LANGUAGES.RUSSIAN')}</span>,
        },
      ],
    },
  ];

  const onSignInClick = async (): Promise<void> => {
    await auth.signinRedirect();
  };

  const onSignOutClick = async (): Promise<void> => {
    await auth.signoutRedirect();
  };

  return (
    <div className={styles.headerToolbar}>
      <Popover
        title={<Text type="secondary">{t('HEADER.NOTIFICATION_POPOVER.NOTIFICATIONS')}</Text>}
        content={
          <NotificationPopover
            notifications={notifications}
            onNotificationViewedConnection={onNotificationViewedConnection}
          />
        }
        trigger="click"
        autoAdjustOverflow={true}
        overlayClassName={styles.notificationOverlay}
      >
        <Badge size="small" count={uncheckedNotificationsCount}>
          <Button title={'Notifications'} icon={<BellOutlined />}></Button>
        </Badge>
      </Popover>
      <Dropdown
        trigger={['click']}
        arrow={true}
        menu={{
          items: languages,
          selectable: true,
          defaultSelectedKeys: [currentLanguage],
          onSelect: (selectInfo) => onLanguageSelect(i18n, selectInfo.key),
        }}
      >
        <Button title={'Language'} type="default" icon={<TranslationOutlined />} />
      </Dropdown>

      <Button
        onClick={toggleTheme}
        title={'Change theme'}
        type={isDarkTheme ? 'primary' : 'default'}
        icon={<FormatPainterOutlined />}
      ></Button>

      {auth.isAuthenticated ? (
        <Button onClick={onSignOutClick} danger type={'default'}>
          {auth.user?.profile.name}
        </Button>
      ) : (
        <Button onClick={onSignInClick} type={'primary'}>
          Sign In
        </Button>
      )}
    </div>
  );
});

export default UserToolBar;
