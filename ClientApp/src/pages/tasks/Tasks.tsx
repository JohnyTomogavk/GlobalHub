import React from 'react';
import Title from 'antd/es/typography/Title';

export const TasksComponent = (): JSX.Element => (
  <>
    <Title level={2}>Tasks page</Title>
    {Array.from({ length: 100 }, (_, index) => (
      <React.Fragment key={index}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, nulla,
        veniam. Amet aspernatur atque cupiditate magni necessitatibus placeat
        repellendus sunt! br
      </React.Fragment>
    ))}
  </>
);
