import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Award } from 'lucide-react';

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="anim-slide-up">
            Ubezpiecz swój samochód<br/>szybko i bezpiecznie
          </h1>
          
          <p className="anim-slide-up delay-100">
            Porównaj oferty, wybierz najlepszy pakiet i kup polisę online w 5 minut.
            Gwarancja najniższej ceny i likwidacja szkód w aplikacji.
          </p>
          
          <div style={{ marginTop: '30px' }} className="anim-slide-up delay-200">
            <Link to="/kalkulator" className="btn-hero primary">Oblicz składkę</Link>
            <Link to="/oferta" className="btn-hero secondary">Zobacz pakiety</Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2rem' }}>Dlaczego my?</h2>
          <p style={{ color: 'var(--text-muted)' }}>Zaufało nam już ponad 10,000 kierowców w całej Polsce.</p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <Zap size={50} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3>Szybkość</h3>
            <p>Kalkulacja w 30 sekund. Brak zbędnych formalności.</p>
          </div>
          
          <div className="feature-item">
            <ShieldCheck size={50} color="var(--secondary)" style={{ marginBottom: '20px' }} />
            <h3>Bezpieczeństwo</h3>
            <p>Twoje dane są szyfrowane, a płatności obsługują certyfikowani operatorzy.</p>
          </div>
          
          <div className="feature-item">
            <Award size={50} color="#10b981" style={{ marginBottom: '20px' }} />
            <h3>Jakość</h3>
            <p>Najwyżej oceniana obsługa klienta w branży ubezpieczeń online w 2025 roku.</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '15px' }}>Gotowy na oszczędności?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              Średni koszt OC w naszym kalkulatorze to tylko 450 PLN. Sprawdź, ile zaoszczędzisz.
            </p>
          </div>
          <Link to="/kalkulator" className="btn-primary" style={{ width: 'auto', padding: '15px 40px' }}>
            Przejdź do kalkulatora &rarr;
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;