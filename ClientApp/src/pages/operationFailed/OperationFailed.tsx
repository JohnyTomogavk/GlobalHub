import React from 'react';
import { Button, Result } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { DASHBOARD_ROUTE } from '../../constants/routingConstants';

export const OperationFailedComponent = (): JSX.Element => {
  const { correlationId } = useParams();
  const errorDescription = `Error ID: ${correlationId}`;

  return (
    <Result
      status="500"
      title="Something went wrong"
      subTitle={errorDescription}
      extra={
        <Link to={`/${DASHBOARD_ROUTE}`}>
          <Button type="primary">Go to Dashboard</Button>
        </Link>
      }
    />
  );
};
