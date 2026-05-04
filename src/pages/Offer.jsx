import { Link } from 'react-router-dom';
import { Car, Home, Heart, Plane, ArrowRight } from 'lucide-react';

const Offer = () => {
  const offers = [
    {
      id: 1,
      icon: <Car size={28} />,
      title: "Ubezpieczenie Samochodu",
      desc: "Pełny pakiet OC/AC. Ochrona od kradzieży, awarii na drodze i darmowe holowanie do 500km.",
      price: "od 300 zł/rok",
      link: "/kalkulator"
    },
    {
      id: 2,
      icon: <Home size={28} />,
      title: "Ubezpieczenie Domu",
      desc: "Chroń swój majątek przed ogniem, zalaniem i kradzieżą. Pakiet Assistance domowy w cenie.",
      price: "od 120 zł/rok",
      link: "/kontakt"
    },
    {
      id: 3,
      icon: <Heart size={28} />,
      title: "Ubezpieczenie Życia",
      desc: "Zabezpieczenie finansowe dla Twoich bliskich. Wypłata świadczenia w ciągu 24h.",
      price: "od 50 zł/mies",
      link: "/kontakt"
    },
    {
      id: 4,
      icon: <Plane size={28} />,
      title: "Podróże (Turystyczne)",
      desc: "Koszty leczenia za granicą, zgubiony bagaż i odwołany lot. Podróżuj bez stresu.",
      price: "od 40 zł/tydzień",
      link: "/kontakt"
    }
  ];

  return (
    <div className="container" style={{ marginTop: '60px', marginBottom: '100px' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Nasza Oferta</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Wybierz polisę dopasowaną do Twoich potrzeb.
        </p>
      </div>

      <div className="offer-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-icon-wrapper">
              {offer.icon}
            </div>
            
            <h3>{offer.title}</h3>
            
            <p>
              {offer.desc}
            </p>
            
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-main)' }}>
              Cena: {offer.price}
            </div>

            <Link to={offer.link} className="btn-link">
              Sprawdź szczegóły <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Offer;