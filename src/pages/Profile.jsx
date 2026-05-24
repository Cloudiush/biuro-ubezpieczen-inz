import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FileText, Calculator as CalcIcon, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "offers"), 
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        const offersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        offersData.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setOffers(offersData);
      } catch (err) {
        console.error("Błąd pobierania ofert:", err);
        toast.error("Nie udało się załadować ofert.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [user]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
        <div className="loader">Ładowanie Twoich ofert...</div>
      </div>
    );
  }

  return (
    <div className="container anim-fade-in" style={{ padding: '40px 20px' }}>
      <div className="profile-header" style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '10px' }}>
          Twoje <span style={{ color: 'var(--primary)' }}>Oferty</span>
        </h1>
        <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>
          Zarządzaj swoimi kalkulacjami i pobieraj gotowe dokumenty PDF
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">
            <FileText size={80} strokeWidth={1} opacity={0.3} />
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Brak aktywnych ofert</h3>
          <p style={{ marginBottom: '30px', opacity: 0.8 }}>
            Wygląda na to, że nie przygotowaliśmy dla Ciebie jeszcze żadnej wyceny. 
            Użyj kalkulatora, aby przesłać zapytanie do naszego agenta.
          </p>
          <button onClick={() => navigate('/kalkulator')} className="btn-primary" style={{ padding: '15px 40px' }}>
            <CalcIcon size={20} style={{ marginRight: '10px' }} />
            Przejdź do kalkulatora
          </button>
        </div>
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="card-badge">Gwarancja Ceny</div>
              
              <div className="card-header">
                <h2 className="car-name">{offer.carBrand}</h2>
                <p className="car-model-info">{offer.carModel} • {offer.carYear}</p>
              </div>

              <div className="card-details">
                <div className="detail-row">
                  <span className="label">Kwota polisy:</span>
                  <span className="price-tag">{offer.price} PLN</span>
                </div>
                <div className="detail-row">
                  <span className="label"><Clock size={14} style={{ marginRight: '5px' }} /> Data wydania:</span>
                  <span>{offer.createdAt?.seconds ? new Date(offer.createdAt.seconds * 1000).toLocaleDateString() : 'Brak daty'}</span>
                </div>
              </div>

              <div className="card-actions">
                <a 
                  href={offer.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <button className="btn-download-full">
                    <FileText size={18} />
                    Pobierz Dokument PDF
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;