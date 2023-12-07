import * as ReactDOMClient from 'react-dom/client';
import React from 'react';
import './config/relativeDateConfig';
import { BrowserRouter } from 'react-router-dom';
import { AppAuthProvider } from './config/oidcConfig';
import { AppRouter } from './router/AppRouter';
import { AppThemeProvider } from './components/appThemeProvider/AppThemeProvider';

const root = ReactDOMClient.createRoot(document.querySelector('#root') as HTMLElement);

const app: JSX.Element = (
  <AppThemeProvider>
    <AppAuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppAuthProvider>
  </AppThemeProvider>
);

root.render(app);
