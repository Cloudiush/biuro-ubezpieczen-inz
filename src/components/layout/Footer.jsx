import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        
        <div className="footer-col">
          <h3>Biuro Ubezpieczeń</h3>
          <p>
            Twój zaufany partner w świecie finansów i bezpieczeństwa. 
            Gwarantujemy najniższe ceny i pełne wsparcie ekspertów.
            <br/><br/>
            <strong>Projekt inżynierski 2026.</strong>
          </p>
        </div>

        <div className="footer-col">
          <h3>Nawigacja</h3>
          <ul>
            <li><Link to="/">Strona Główna</Link></li>
            <li><Link to="/oferta">Oferta</Link></li>
            <li><Link to="/kalkulator">Kalkulator</Link></li>
            <li><Link to="/kontakt">Kontakt</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Kontakt</h3>
          <ul>
            <li>ul. Ubezpieczeniowa 12</li>
            <li>00-001 Warszawa</li>
            <li>tel. 123 456 789</li>
            <li>kontakt@biuro.pl</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Biuro Ubezpieczeń. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;