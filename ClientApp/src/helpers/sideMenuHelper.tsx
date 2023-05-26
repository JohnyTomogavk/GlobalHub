import React, { MouseEventHandler } from 'react';
import styles from '../components/layout/sideMenu/SideMenu.module.scss';
import { Button } from 'antd';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';

// TODO: Consider possiblity to extract these functions to separate component
export const getTopLevelItemTitleWithAddButton = (title: string, onClick?: MouseEventHandler): JSX.Element => (
  <span className={[styles.sideMenuItemTitleContainer, styles.topLevelItem].join(' ')}>
    <span className={styles.itemTitle}>{title}</span>
    {onClick && (
      <Button onClick={onClick} className={styles.sideMenuActionButton} size={'small'} icon={<PlusOutlined />} />
    )}
  </span>
);

export const getItemTitleWithOptionsButton = (title: string): JSX.Element => (
  <span className={styles.sideMenuItemTitleContainer}>
    <span className={styles.itemTitle}>{title}</span>
    <Button
      className={styles.sideMenuActionButton}
      onClick={(e): void => {
        e.stopPropagation();
      }}
      size={'small'}
      icon={<EllipsisOutlined />}
    />
  </span>
);
