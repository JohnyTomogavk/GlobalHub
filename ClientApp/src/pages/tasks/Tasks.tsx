import React from 'react';
import { Typography } from 'antd';
import styles from './tasks.module.scss';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';

const { Text } = Typography;
export const TasksComponent = (): JSX.Element => (
  <>
    <ItemInfoSubHeader />
    <div className={styles.content}>
      {Array.from({ length: 100 }, (_, index) => (
        <React.Fragment key={index}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, nulla, veniam. Amet aspernatur atque
            cupiditate magni necessitatibus placeat repellendus sunt! br
          </Text>
        </React.Fragment>
      ))}
    </div>
  </>
);
