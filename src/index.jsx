import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#48bb78' } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);