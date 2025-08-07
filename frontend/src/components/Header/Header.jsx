import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import './Header.css';
import UserAuthentication from '../UserAuthentication/UserAuthentication';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <header id="header" className="header fixed-top">
      <div className="header-container">
        <div className="logo-wrap">
          <Link to="/" className="logo d-flex align-items-center">
            <img src={Logo} alt="TRAVEL" />
          </Link>
        </div>

        <nav id="navbar" className="navbar">
          <ul className="nav-list">
            <li><Link className="nav-link" to="/">Home</Link></li>
            <li><Link className="nav-link" to="/leads">Leads</Link></li>
            <li><Link className="nav-link" to="/oppurtunities">Oppurtunities</Link></li>
            <li><Link className="nav-link" to="/account">Account</Link></li>
            <li><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="auth-section">
          {!isLoggedIn ? (
            <Link className="login-btn" to='/login'>Login</Link>
          ) : (
            <div className="profile">
              <div className="profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <i className="bi bi-person-circle"></i>
                <span>Person</span><i className="bi bi-caret-down-fill"></i>
              </div>
              {showDropdown && (
                <ul className="dropdown-menu">
                  <li><Link to="/profile">My Profile</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
