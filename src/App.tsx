import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ScenarioSimulator from './components/ScenarioSimulator';
import TraderCoaching from './components/TraderCoaching';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/simulator" element={<ScenarioSimulator />} />
        <Route path="/coaching" element={<TraderCoaching />} />
      </Routes>
    </Layout>
  );
};

export default App; 