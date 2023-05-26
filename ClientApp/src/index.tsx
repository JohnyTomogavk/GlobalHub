import * as ReactDOMClient from 'react-dom/client';
import React from 'react';
import { App } from './components/app/App';
import './config/localizationConfigurator';
import './config/relativeDateConfig';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOMClient.createRoot(document.querySelector('#root') as HTMLElement);

const app: JSX.Element = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

root.render(app);
