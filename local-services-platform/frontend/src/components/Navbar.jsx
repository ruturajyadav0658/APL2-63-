import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { user, logout, initializing } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Local Services</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
          aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item me-2">
              <button
                type="button"
                className="btn btn-outline-light"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
            </li>
            {!initializing && user?.role !== 'provider' && (
              <li className="nav-item"><Link className="nav-link" to="/services">Services</Link></li>
            )}
            {!initializing && user && (
              <>
                {user.role === 'provider' ? (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/provider/bookings">Bookings</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/provider/services">My Services</Link></li>
                  </>
                ) : (
                  <li className="nav-item"><Link className="nav-link" to="/bookings">Bookings</Link></li>
                )}
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><button className="btn btn-outline-light ms-2" onClick={() => { logout(); navigate('/'); }}>Logout</button></li>
              </>
            )}
            {!initializing && !user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                <li className="nav-item"><Link className="btn btn-primary ms-2" to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}


