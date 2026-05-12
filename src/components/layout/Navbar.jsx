import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, isAdmin, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Wylogowano pomyślnie.");
      navigate('/login');
    } catch (error) {
      toast.error("Błąd podczas wylogowywania.");
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* LOGO */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Biuro Ubezpieczeń
        </Link>

        {/* PRZYCISK MENU MOBILNEGO */}
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✖' : '☰'}
        </button>

        {/* MENU NAWIGACYJNE */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Strona Główna</Link>
          <Link to="/oferta" className="nav-link" onClick={closeMenu}>Oferta</Link>
          <Link to="/kalkulator" className="nav-link" onClick={closeMenu}>Kalkulator</Link>
          <Link to="/kontakt" className="nav-link" onClick={closeMenu}>Kontakt</Link>

          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
              Panel Admina
            </Link>
          )}

          {/* AKCJE UŻYTKOWNIKA */}
          <div className="user-actions">
            <button onClick={toggleDarkMode} className="theme-toggle" title="Przełącz motyw">
              {darkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="user-profile">
                <span className="user-email">{user.email}</span>
                <button onClick={() => { handleLogout(); closeMenu(); }} className="btn-primary logout-btn">
                  Wyloguj
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-outline auth-btn" onClick={closeMenu}>Zaloguj</Link>
                <Link to="/register" className="btn-primary auth-btn" onClick={closeMenu}>Dołącz</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;