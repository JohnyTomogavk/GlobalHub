import React, { ReactNode, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import styles from '../../styles.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const loader = (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
    }}
  >
    <Spin className={styles.loader} size={'large'} indicator={<LoadingOutlined spin />} />
  </div>
);

const GuardedComponent = (props: { children: ReactNode }): JSX.Element => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isLoading) {
    return loader;
  }

  return <>{props.children}</>;
};

export default GuardedComponent;
