// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Optional: if you want to style the homepage

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to FoodDRIVE</h1>
      <p>Our platform helps connect food banks with donors</p>
      <Link to="/donation-search">
        <button className="home-button">Go to Donation Search</button>
      </Link>
    </div>
  );
}

export default Home;
