import React from 'react';
import { Typography } from 'antd';
import styles from './budjet.module.scss';

const { Text } = Typography;

export const BudgetListComponent = (): JSX.Element => (
  <>
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
