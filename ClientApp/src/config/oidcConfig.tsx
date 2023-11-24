import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import React, { ReactNode } from 'react';
import { WebStorageStateStore } from 'oidc-client-ts';

// TODO: Get required values from env variables
export const oidcConfig: AuthProviderProps = {
  authority: 'https://localhost:7389',
  client_id: 'global-hub-local',
  redirect_uri: 'http://localhost:8080/notes',
  post_logout_redirect_uri: 'http://localhost:8080',
  response_type: 'code',
  scope: 'GlobalHub.BudgetsAPI GlobalHub.NotesAPI openid profile',
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const AppAuthProvider = (props: { children: ReactNode }): JSX.Element => (
  <AuthProvider {...oidcConfig}>{props.children}</AuthProvider>
);
