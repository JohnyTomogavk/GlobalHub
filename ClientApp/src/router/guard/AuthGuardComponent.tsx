import React, { ReactNode, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Loader } from '../../components/loader/Loader';
import { useNavigate } from 'react-router-dom';
import { WELCOME_PAGE_ROUTE } from '../../constants/routingConstants';
import { Typography } from 'antd';
import { getItem } from '../../helpers/localStorageHelper';

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

  const hasStoredAuthParams = (): boolean => {
    const storageAuthItemKey = `oidc.user:${auth.settings.authority}:${auth.settings.client_id}`;

    return getItem(storageAuthItemKey) !== null;
  };

  if (hasStoredAuthParams() && !auth.isAuthenticated && !auth.isLoading && !hasTriedSignIn) {
    auth.signinSilent();
    setHasTriedSignIn(true);
  }

  if (!hasStoredAuthParams() && !auth.isLoading && !auth.isAuthenticated) {
    navigate(`/${WELCOME_PAGE_ROUTE}`);
  }

  if (auth.isAuthenticated) {
    return <>{props.children}</>;
  }

  return loader;
};

export default AuthGuardComponent;
