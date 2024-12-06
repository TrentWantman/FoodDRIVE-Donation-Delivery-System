  import React, { useState } from 'react';
  import './Header.css';

  function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // for hamburger menu
    const [isAccountOpen, setIsAccountOpen] = useState(false); // for account info circle

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleAccount = () => setIsAccountOpen(!isAccountOpen);

    return (
      <header className="header">
        {/* Hamburger Menu Icon */}
        <div className="hamburger-icon" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Account Info Circle */}
        <div className="account-icon" onClick={toggleAccount}>
          <div className="account-circle"></div>
        </div>

        {/* Hamburger Menu - links */}
        {isMenuOpen && (
          <nav className="nav-menu">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/donation-search">Search</a></li>
            </ul>
          </nav>
        )}

        {/* Account Info Dropdown */}
        {isAccountOpen && (
          <div className="account-dropdown">
            <ul>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/settings">Settings</a></li>
              <li><a href="/logout">Logout</a></li>
            </ul>
          </div>
        )}
      </header>
    );
  }

  export default Header;
