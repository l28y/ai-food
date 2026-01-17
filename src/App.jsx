import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Compare from './pages/Compare';
import History from './pages/History';
import AnalysisResult from './pages/AnalysisResult';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/history" element={<History />} />
        <Route path="/analysis/:id" element={<AnalysisResult />} />
      </Routes>
    </HashRouter>
  );
};

export default App;