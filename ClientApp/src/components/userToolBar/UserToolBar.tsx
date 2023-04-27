import { Avatar, Badge, Button, Dropdown, Popover, Typography } from 'antd';
import { BellOutlined, TranslationOutlined } from '@ant-design/icons';
import React from 'react';
import userIcon from '/assets/png1.png';
import NotificationPopover from '../notificationPopover/NotificationPopover';
import { EN, RU } from '../../constants/languages.constants';
import { useTranslation } from 'react-i18next';
import { i18n as i18n_type } from 'i18next';
import styles from './UserToolBar.module.scss';
import { SideMenuItem } from '../../models/sideMenu/menuItem';

const { Text } = Typography;

const onLanguageSelect = (i18: i18n_type, selectedLanguage: string): void => {
  i18.changeLanguage(selectedLanguage).then();
};

const UserToolBar = (): JSX.Element => {
  const { i18n } = useTranslation();
  const { t } = i18n;

  const languages: SideMenuItem[] = [
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

  const userName = 'Johny Tomogavk';

  return (
    <div className={styles.headerToolbar}>
      <Popover
        title={
          <Text type="secondary">
            {t('HEADER.NOTIFICATION_POPOVER.NOTIFICATIONS')}
          </Text>
        }
        content={<NotificationPopover />}
        trigger="click"
        overlayClassName={styles.notificationOverlay}
        placement="bottomLeft"
      >
        <Badge size="small" count={4}>
          <Button icon={<BellOutlined />}></Button>
        </Badge>
      </Popover>

      <Dropdown
        trigger={['click']}
        arrow={true}
        menu={{
          items: languages,
          selectable: true,
          defaultSelectedKeys: [EN],
          onSelect: (selectInfo) => onLanguageSelect(i18n, selectInfo.key),
        }}
      >
        <Button type="default" icon={<TranslationOutlined />} />
      </Dropdown>

      <Avatar src={userIcon} shape={'square'} />
      <span className={styles.userName}>{userName}</span>
    </div>
  );
};

export default UserToolBar;
