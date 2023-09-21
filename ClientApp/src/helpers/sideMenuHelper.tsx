import React, { MouseEventHandler } from 'react';
import styles from '../components/layout/sideMenu/SideMenu.module.scss';
import { Button } from 'antd';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';

export const getTopLevelItemTitle = (title: string, onClick?: MouseEventHandler): JSX.Element => (
  <span className={[styles.sideMenuItemTitleContainer, styles.topLevelItem].join(' ')}>
    <span className={styles.itemTitle}>{title}</span>
    {onClick && (
      <Button onClick={onClick} className={styles.sideMenuActionButton} size={'small'} icon={<PlusOutlined />} />
    )}
  </span>
);

export const getSecondaryLevelItemTitle = (title: string): JSX.Element => (
  <span className={styles.sideMenuItemTitleContainer}>
    <span className={styles.itemTitle}>{title}</span>
    <Button
      className={styles.sideMenuActionButton}
      onClick={(e): void => {
        // TODO: Open popover with options
        e.stopPropagation();
      }}
      size={'small'}
      icon={<EllipsisOutlined />}
    />
  </span>
);
