import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import DonationSearch from './components/DonationSearch';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places', 'geometry'];

function App() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Router>
        <div className="App">
          <Routes>
            {/* Redirect from the root path to the Login page */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/donation-search" element={<DonationSearch />} />
          </Routes>
        </div>
      </Router>
    </LoadScript>
  );
}

export default App;


