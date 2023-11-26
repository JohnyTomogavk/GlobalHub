import * as ReactDOMClient from 'react-dom/client';
import React from 'react';
import { App } from './components/app/App';
import './config/relativeDateConfig';
import { BrowserRouter } from 'react-router-dom';
import { AppAuthProvider } from './config/oidcConfig';

const root = ReactDOMClient.createRoot(document.querySelector('#root') as HTMLElement);

const app: JSX.Element = (
  <BrowserRouter>
    <AppAuthProvider>
      <App />
    </AppAuthProvider>
  </BrowserRouter>
);

root.render(app);
