import * as ReactDOMClient from 'react-dom/client';
import React from 'react';
import './config/relativeDateConfig';
import { BrowserRouter } from 'react-router-dom';
import { AppAuthProvider } from './config/oidcConfig';
import { AppRouter } from './router/AppRouter';

const root = ReactDOMClient.createRoot(document.querySelector('#root') as HTMLElement);

const app: JSX.Element = (
  <AppAuthProvider>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </AppAuthProvider>
);

root.render(app);
