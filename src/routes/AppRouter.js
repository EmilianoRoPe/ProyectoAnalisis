import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ItinerariesSavedPage from '../pages/ItinerariesSavedPage';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/itinerariesSaved" element={<ItinerariesSavedPage/>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;