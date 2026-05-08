import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* SEKCJA HERO */}
      <section className="hero-section">
        <div className="hero-content anim-slide-up">
          <h1>Ubezpiecz swój samochód<br/>szybko i bezpiecznie</h1>
          <p>Porównaj oferty, wybierz najlepszy pakiet i kup polisę online w 5 minut.</p>
          <div className="hero-btns">
            <Link to="/kalkulator" className="btn-hero primary">Oblicz składkę</Link>
            <Link to="/oferta" className="btn-hero secondary">Zobacz pakiety</Link>
          </div>
        </div>
      </section>

      {/* SEKCJA CECHY (Dlaczego my) */}
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

      {/* BANER CTA - To ten element przesuwamy do góry */}
      <div className="cta-wrapper container">
        <section className="cta-banner anim-slide-up">
          <div className="cta-content">
            <h2>Gotowy na oszczędności?</h2>
            <p>Średni koszt OC w naszym kalkulatorze to tylko 450 PLN. Sprawdź, ile zaoszczędzisz.</p>
          </div>
          <Link to="/kalkulator" className="btn-hero primary">Przejdź do kalkulatora →</Link>
        </section>
      </div>
    </div>
  );
};

export default Home;