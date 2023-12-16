import { Badge, Button, Dropdown, Popover, Typography } from 'antd';
import { BellOutlined, FormatPainterOutlined, TranslationOutlined } from '@ant-design/icons';
import React from 'react';
import NotificationPopover from '../notificationPopover/NotificationPopover';
import { EN, RU } from '../../../constants/languagesConstants';
import { useTranslation } from 'react-i18next';
import { i18n as i18n_type } from 'i18next';
import { antdMenuItem } from '../../../models/shared/antdMenuItem';
import CommonStore from '../../../store/uiConfigStore';
import { observer } from 'mobx-react-lite';
import styles from './UserToolBar.module.scss';
import { useAuth } from 'react-oidc-context';

const { Text } = Typography;

const UserToolBar = observer((): JSX.Element => {
  const { i18n } = useTranslation();
  const { t } = i18n;
  const { currentLanguage, setLanguage, isDarkTheme, toggleTheme } = CommonStore;
  const auth = useAuth();

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
        content={<NotificationPopover />}
        trigger="click"
        overlayClassName={styles.notificationOverlay}
        placement="bottomLeft"
      >
        <Badge size="small" count={4}>
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
