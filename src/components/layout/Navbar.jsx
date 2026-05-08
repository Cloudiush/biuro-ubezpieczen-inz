import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, isAdmin, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Wylogowano pomyślnie.");
      navigate('/login');
    } catch (error) {
      toast.error("Błąd podczas wylogowywania.");
    }
  };

  return (
    <nav className="navbar" style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      borderBottom: '1px solid var(--border-color)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* LOGO */}
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          color: 'var(--primary)', 
          textDecoration: 'none' 
        }}>
        Biuro Ubezpieczeń
        </Link>

        {/* LINKI NAWIGACYJNE */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" className="nav-item">Strona Główna</Link>
          <Link to="/kalkulator" className="nav-item">Kalkulator</Link>
          <Link to="/kontakt" className="nav-item">Kontakt</Link>

          {/* WARUNKOWY PANEL ADMINA */}
          {isAdmin && (
            <Link 
              to="/admin" 
              style={{ 
                color: 'var(--primary)', 
                fontWeight: 'bold',
                padding: '5px 10px',
                border: '1px solid var(--primary)'
              }}
            >
              Panel Admina
            </Link>
          )}
        </div>

        {/* AKCJE UŻYTKOWNIKA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Przełącznik Dark Mode */}
          <button 
            onClick={toggleDarkMode} 
            className="btn-outline" 
            style={{ padding: '8px 12px', fontSize: '1.2rem' }}
            title="Przełącz motyw"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <Link to="/profile" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {user.email}
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn-outline"
                style={{ padding: '8px 20px' }}
              >
                Wyloguj
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn-outline" style={{ padding: '8px 20px' }}>Zaloguj</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px' }}>Dołącz</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;