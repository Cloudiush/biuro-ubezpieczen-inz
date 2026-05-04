import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-content">
        <div className="footer-column">
          <h3>Biuro Ubezpieczeń</h3>
          <p>Twój zaufany partner w świecie finansów i bezpieczeństwa. Projekt inżynierski 2026.</p>
        </div>
        
        <div className="footer-column">
          <h4>Nawigacja</h4>
          <ul>
            <li><Link to="/">Strona Główna</Link></li>
            <li><Link to="/oferta">Oferta</Link></li>
            <li><Link to="/kalkulator">Kalkulator</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Kontakt</h4>
          <p>ul. Ubezpieczeniowa 12</p>
          <p>Warszawa</p>
          <p>tel. 123 456 789</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Projekt</p>
      </div>
    </footer>
  );
};

export default Footer;