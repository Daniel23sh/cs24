import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AuthCallback from './components/AuthCallback';
import ProfilePage from './components/profilepage';
import ScrollToTop from './components/ScrollToTop'; 

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Always scroll to top on navigation */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/tutors/:tutorName" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 