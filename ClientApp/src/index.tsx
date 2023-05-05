import * as ReactDOMClient from 'react-dom/client';
import React from 'react';
import App from './components/app/App';
import { ConfigProvider, theme } from 'antd';
import './config/localizationConfigurator';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOMClient.createRoot(
  document.querySelector('#root') as HTMLElement
);

const app: JSX.Element = (
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: [theme.defaultAlgorithm],
        token: {
          borderRadius: 0,
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);

root.render(app);
