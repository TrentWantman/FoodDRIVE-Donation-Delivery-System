import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import DonationSearch from './components/DonationSearch';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donation-search" element={<DonationSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
