import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
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
  const [hasTriedSignIn, setHasTriedSignIn] = useState(false);

  useEffect(() => {
    if (!hasTriedSignIn && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinSilent().then(() => {
        if (auth.isAuthenticated) return;

        navigate(`/${WELCOME_PAGE_ROUTE}`);
      });

      setHasTriedSignIn(true);
    }
  }, [auth, hasTriedSignIn, navigate]);

  if (auth.isAuthenticated) {
    return <>{props.children}</>;
  }

  return loader;
};

export default AuthGuardComponent;
