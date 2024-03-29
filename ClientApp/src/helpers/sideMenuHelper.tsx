import React, { MouseEventHandler } from 'react';
import styles from '../components/layout/sideMenu/SideMenu.module.scss';
import { Button } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { EntityType } from '../enums/entityType';
import { getUnnamedTitleByNodeType } from './entityHelper';

export const getTopLevelItemTitle = (title: string, onClick?: MouseEventHandler): JSX.Element => (
  <span className={[styles.sideMenuItemTitleContainer, styles.topLevelItem].join(' ')}>
    <span className={styles.itemTitle}>{title}</span>
    {onClick && (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        type={'text'}
        className={styles.sideMenuActionButton}
        size={'small'}
        icon={<PlusOutlined />}
      />
    )}
  </span>
);

export const getSecondaryLevelItemTitle = (title: string, entityType: EntityType): JSX.Element => (
  <span className={styles.sideMenuItemTitleContainer}>
    <span className={styles.itemTitle}>{title.length === 0 ? getUnnamedTitleByNodeType(entityType) : title}</span>
    <Button
      type={'text'}
      className={styles.sideMenuActionButton}
      onClick={(e): void => {
        // TODO: Open popover with options
        e.stopPropagation();
      }}
      size={'small'}
      icon={<MoreOutlined />}
    />
  </span>
);
