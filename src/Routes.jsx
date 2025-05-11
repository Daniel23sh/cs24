import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AuthCallback from './components/AuthCallback';

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Always scroll to top on navigation */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 