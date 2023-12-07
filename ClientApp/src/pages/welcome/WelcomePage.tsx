import React from 'react';
import { useAuth } from 'react-oidc-context';
import Button from 'antd/es/button';

export const WelcomePage = (): JSX.Element => {
  const auth = useAuth();

  const onSignInClick = async (): Promise<void> => {
    await auth.signinRedirect();
  };

  return (
    <>
      {auth.user?.profile.name}
      <Button onClick={onSignInClick}>Login</Button>
    </>
  );
};
