import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { DASHBOARD_ROUTE } from '../../constants/routingConstants';

export const NotFound = (): JSX.Element => (
  <Result
    status="404"
    title="Resource not found"
    subTitle="We can't find requested item or you don't have according permissions to view it"
    extra={
      <Link to={`/${DASHBOARD_ROUTE}`}>
        <Button type="primary">Go to Dashboard</Button>
      </Link>
    }
  />
);
