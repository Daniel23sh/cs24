import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import AuthCallback from '../components/AuthCallback';
import GpaCalc from '../pages/GpaCalc';
import Courses from '../pages/Courses';
import ProfilePage from '../pages/ProfilePage';
import ScrollToTop from '../components/ScrollToTop'; 
import NotFoundPage from '../components/NotFoundPage';
import CourseDetails from '../pages/CourseDetails';
import NoAccessPage from '../pages/NoAccessPage';
import CourseCreationPage from '../pages/CourseCreationPage';
import CourseEditorPage from '../pages/CourseEditorPage';
import UploadSuccess from '../pages/UploadSuccess';
import UserDashboard from '../pages/userDashboard';
import About from '../pages/About';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import ThankYou from '../pages/ThankYou';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/gpa" element={<GpaCalc />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/tutors/:courseType/:id" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/create-course" element={<CourseCreationPage />} />
        <Route path="/course-editor/:courseId" element={<CourseEditorPage />} />
        <Route path="/no-access" element={<NoAccessPage />} />
        <Route path="/upload-success" element={<UploadSuccess />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 

