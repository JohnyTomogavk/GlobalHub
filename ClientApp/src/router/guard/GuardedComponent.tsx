import React, { ReactNode, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Loader } from '../../components/loader/Loader';
import { Typography } from 'antd';
import Title from 'antd/es/typography/Title';
const { Text } = Typography;

const loader = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Loader size={'large'} />
    <Title level={3}>Global Hub</Title>
    <Text type={'secondary'} italic={true}>
      Loading...
    </Text>
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
