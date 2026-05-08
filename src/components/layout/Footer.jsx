import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content container">
        <div className="footer-column">
          <h3>Biuro<span>Ubezpieczeń</span></h3>
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
          <ul>
            <li>ul. Ubezpieczeniowa 12</li>
            <li>00-001 Warszawa</li>
            <li>tel. 123 456 789</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Biuro Ubezpieczeń. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
};

export default Footer;