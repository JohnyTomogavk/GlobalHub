import React from 'react';
import { Breadcrumb } from 'antd';
import styles from './AppContent.module.scss';
import Title from 'antd/es/typography/Title';

export const AppContent = (): JSX.Element => (
  <>
    <Breadcrumb
      items={[
        {
          title: 'Budgets',
        },
        {
          title: <a href="">Application Center</a>,
        },
        {
          title: <a href="">Application List</a>,
        },
        {
          title: 'An Application',
        },
      ]}
      className={styles.breadCrumps}
    ></Breadcrumb>
    <div className={styles.contentContainer}>
      <Title level={2}>New topic</Title>
      {Array.from({ length: 100 }, (_, index) => (
        <React.Fragment key={index}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, nulla,
          veniam. Amet aspernatur atque cupiditate magni necessitatibus placeat
          repellendus sunt! br
        </React.Fragment>
      ))}
    </div>
  </>
);
