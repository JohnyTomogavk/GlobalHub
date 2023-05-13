import React from 'react';
import Title from 'antd/es/typography/Title';
import { Typography } from 'antd';

const { Text } = Typography;

export const DashboardComponent = (): JSX.Element => (
  <>
    <Title level={2}>Dashboard page</Title>
    {Array.from({ length: 100 }, (_, index) => (
      <React.Fragment key={index}>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, nulla, veniam. Amet aspernatur atque cupiditate
          magni necessitatibus placeat repellendus sunt! br
        </Text>
      </React.Fragment>
    ))}
  </>
);
