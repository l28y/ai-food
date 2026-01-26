import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import Home from './pages/Home';
import Compare from './pages/Compare';
import History from './pages/History';
import AnalysisResult from './pages/AnalysisResult';
import Settings from './pages/Settings';

const appTheme = {
  token: {
    colorPrimary: '#48bb78',
  },
};

const App = () => {
  return (
    <ConfigProvider theme={theme.defaultAlgorithm}>
      <AntdApp theme={appTheme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/history" element={<History />} />
            <Route path="/analysis/:id" element={<AnalysisResult />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </HashRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;