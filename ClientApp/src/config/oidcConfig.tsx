import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import React, { ReactNode } from 'react';
import { WebStorageStateStore } from 'oidc-client-ts';
import { getEnvVar } from './environmentVariables';
import { API_GATEWAY_BASE, IDENTITY_API_SUFFIX } from '../constants/apiConstants';

const identityUrl = `${API_GATEWAY_BASE}/${IDENTITY_API_SUFFIX}`;

export const oidcConfig: AuthProviderProps = {
  authority: identityUrl,
  client_id: getEnvVar('CLIENT_ID', process.env.CLIENT_ID),
  redirect_uri: getEnvVar('REDIRECT_URI', process.env.REDIRECT_URI),
  post_logout_redirect_uri: getEnvVar('POST_LOGOUT_REDIRECT_URI', process.env.POST_LOGOUT_REDIRECT_URI),
  response_type: 'code',
  scope: 'GlobalHub.BudgetsAPI GlobalHub.NotesAPI GlobalHub.API_Gateway openid profile',
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const AppAuthProvider = (props: { children: ReactNode }): JSX.Element => (
  <AuthProvider {...oidcConfig}>{props.children}</AuthProvider>
);
