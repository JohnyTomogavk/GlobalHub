import React, { ReactNode, useEffect } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { Loader } from '../../components/loader/Loader';
import { useNavigate } from 'react-router-dom';
import { WELCOME_PAGE_ROUTE } from '../../constants/routingConstants';
import { Typography } from 'antd';

const { Text, Title } = Typography;

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

const AuthGuardComponent = (props: { children: ReactNode }): JSX.Element => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      if (!hasAuthParams()) {
        navigate(`/${WELCOME_PAGE_ROUTE}`);
      }

      auth.signinSilent().then(() => {
        if (!auth.isAuthenticated) navigate(`/${WELCOME_PAGE_ROUTE}`);
      });
    }
  }, [auth.error, auth.isLoading]);

  if (auth.isLoading || !auth.isAuthenticated) {
    return loader;
  }

  return <>{props.children}</>;
};

export default AuthGuardComponent;
