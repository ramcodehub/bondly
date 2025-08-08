import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="TRAVEL" className="h-12 sm:h-16 w-auto" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <i className={`bi text-xl ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>

        <nav className={`lg:flex ${menuOpen ? 'block' : 'hidden'} absolute lg:relative top-full left-0 right-0 lg:top-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none border-t lg:border-t-0`}>
          <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            <li className="border-b lg:border-b-0">
              <Link className="block px-4 py-3 lg:py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 lg:hover:bg-transparent transition-colors" to="/">Home</Link>
            </li>
            <li className="border-b lg:border-b-0">
              <Link className="block px-4 py-3 lg:py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 lg:hover:bg-transparent transition-colors" to="/leads">Leads</Link>
            </li>
            <li className="border-b lg:border-b-0">
              <Link className="block px-4 py-3 lg:py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 lg:hover:bg-transparent transition-colors" to="/opportunities">Opportunities</Link>
            </li>
            <li className="border-b lg:border-b-0">
              <Link className="block px-4 py-3 lg:py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 lg:hover:bg-transparent transition-colors" to="/account">Account</Link>
            </li>
            <li className="border-b lg:border-b-0">
              <Link className="block px-4 py-3 lg:py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 lg:hover:bg-transparent transition-colors" to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <div className="hidden lg:block">
          {!isLoggedIn ? (
            <Link className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors" to='/login'>Login</Link>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                <i className="bi bi-person-circle text-xl"></i>
                <span className="text-sm">Person</span>
                <i className="bi bi-caret-down-fill text-xs"></i>
              </div>
              {showDropdown && (
                <ul className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 min-w-[150px]">
                  <li>
                    <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" to="/profile">My Profile</Link>
                  </li>
                  <li>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-3">
              {!isLoggedIn ? (
                <Link className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md text-center text-sm font-medium" to='/login'>Login</Link>
              ) : (
                <div className="flex items-center gap-2">
                  <i className="bi bi-person-circle text-xl"></i>
                  <span className="text-sm">Person</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
