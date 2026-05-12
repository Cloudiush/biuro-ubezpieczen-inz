import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-wrapper">
      <section className="hero-section">
        <div className="container hero-content anim-slide-up">
          <h1>Ubezpiecz swój samochód<br/>szybko i bezpiecznie</h1>
          <p>Porównaj oferty, wybierz najlepszy pakiet i kup polisę online w 5 minut.</p>
          <div className="hero-btns">
            <Link to="/kalkulator" className="btn-primary">Oblicz składkę</Link>
            <Link to="/oferta" className="btn-outline">Zobacz pakiety</Link>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-title">
          <h2>Dlaczego my?</h2>
          <p>Zaufało nam już ponad 10,000 kierowców w całej Polsce.</p>
        </div>
        <div className="features-grid">
          <div className="feature-item anim-slide-up">
            <div className="feature-icon">⚡</div>
            <h3>Szybkość</h3>
            <p>Kalkulacja w 30 sekund. Brak zbędnych formalności.</p>
          </div>
          <div className="feature-item anim-slide-up">
            <div className="feature-icon">🛡️</div>
            <h3>Bezpieczeństwo</h3>
            <p>Twoje dane są szyfrowane i bezpieczne.</p>
          </div>
          <div className="feature-item anim-slide-up">
            <div className="feature-icon">⭐</div>
            <h3>Jakość</h3>
            <p>Najwyżej oceniana obsługa klienta w 2025 roku.</p>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="cta-banner anim-slide-up">
          <h2>Gotowy na oszczędności?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Średni koszt OC w naszym kalkulatorze to tylko 450 PLN. Sprawdź, ile zaoszczędzisz.</p>
          <Link to="/kalkulator" className="btn-primary">Przejdź do kalkulatora →</Link>
        </section>
      </div>
    </div>
  );
};

export default Home;