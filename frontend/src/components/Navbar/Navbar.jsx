import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { title: "Home", path: "/" },
    { title: "Leads", path: "/leads" },
    { title: "Opportunities", path: "/opportunities" },
    { title: "Account", path: "/account" },
    { title: "Contact", path: "/contact" },
  ];

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* Left - Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center no-underline hover:no-underline focus:no-underline"
          >
            <img
              src="/logo.png" // change to your logo path
              alt="Logo"
              className="h-14 md:h-18 w-auto mr-0"
            />
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              
            </span>
          </Link>
        </div>

        {/* Center - Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors no-underline hover:no-underline ${
                location.pathname === link.path
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Right - Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors no-underline hover:no-underline"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors no-underline hover:no-underline"
          >
            Signup
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobile}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40">
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-4 flex flex-col z-50">
            <button onClick={toggleMobile} className="self-end mb-4">
              <X className="h-6 w-6" />
            </button>

            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={toggleMobile}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline hover:no-underline ${
                  location.pathname === link.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.title}
              </Link>
            ))}

            <div className="mt-auto pt-4 border-t">
              <Link
                to="/login"
                onClick={toggleMobile}
                className="block px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors no-underline hover:no-underline mb-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={toggleMobile}
                className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors no-underline hover:no-underline"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}








