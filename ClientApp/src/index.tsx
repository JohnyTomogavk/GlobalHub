import * as ReactDOMClient from 'react-dom/client';
import React from 'react';
import App from './components/app/App';
import { ConfigProvider, theme } from 'antd';
import './services/localizationService';

const root = ReactDOMClient.createRoot(
  document.querySelector('#root') as HTMLElement
);

const app: JSX.Element = (
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: [theme.defaultAlgorithm],
        token: {
          borderRadius: 1,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

root.render(app);
