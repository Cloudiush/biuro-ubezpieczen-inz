import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Menu, X, User, Shield } from 'lucide-react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  const ADMIN_EMAIL = "admin@admin.com";

  return (
    <nav className="navbar">
      <div className="container nav-container">
        
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Biuro<span style={{ color: 'var(--secondary)' }}>Ubezpieczeń</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="theme-toggle"
            title={darkMode ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <div className="hamburger" onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item"><Link to="/" className="nav-link" onClick={closeMenu}>Start</Link></li>
          <li className="nav-item"><Link to="/oferta" className="nav-link" onClick={closeMenu}>Oferta</Link></li>
          <li className="nav-item"><Link to="/kalkulator" className="nav-link" onClick={closeMenu}>Kalkulator</Link></li>
          <li className="nav-item"><Link to="/kontakt" className="nav-link" onClick={closeMenu}>Kontakt</Link></li>

          {user ? (
            <>
              {user.email === ADMIN_EMAIL && (
                <li className="nav-item">
                  <Link 
                    to="/admin" 
                    className="nav-link" 
                    onClick={closeMenu}
                    style={{ 
                      color: '#e11d48', 
                      fontWeight: 'bold', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px' 
                    }}
                  >
                    <Shield size={18} /> ADMIN
                  </Link>
                </li>
              )}

              <li className="nav-item">
                 <Link 
                   to="/profil" 
                   className="nav-link" 
                   onClick={closeMenu} 
                   style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}
                 >
                   <User size={18} />
                   <span style={{fontWeight: '600', fontSize: '0.9rem'}}>{user.email}</span>
                 </Link>
              </li>
              
              <li className="nav-item">
                <button onClick={handleLogout} className="btn-outline" style={{padding: '6px 16px', fontSize: '0.9rem', cursor: 'pointer'}}>
                  Wyloguj
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/logowanie" className="nav-link" onClick={closeMenu} style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
                Zaloguj się
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;