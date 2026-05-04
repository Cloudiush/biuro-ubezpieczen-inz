import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OfferDocument from '../components/pdf/OfferDocument';
import { FileText } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/logowanie');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "offers"), 
          where("uid", "==", user.uid)
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
      } catch (error) {
        console.error("Błąd pobierania ofert:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [user]);

  if (loading) return <div className="container" style={{textAlign:'center', marginTop: '50px'}}>Ładowanie danych...</div>;

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div className="profile-header">
        <h1>Twój Profil</h1>
        <p>Zalogowany jako: <strong>{user?.email}</strong></p>
      </div>

      <div className="profile-content">
        <h2>Historia Twoich kalkulacji</h2>
        
        {offers.length === 0 ? (
          <div className="empty-state">
            <p>Nie masz jeszcze zapisanych ofert.</p>
            <button onClick={() => navigate('/kalkulator')} className="btn-primary" style={{maxWidth: '200px'}}>
              Przejdź do kalkulatora
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="offers-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Samochód</th>
                  <th>Silnik</th>
                  <th>Cena</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      {offer.createdAt?.toDate ? (
                        <>
                          {offer.createdAt.toDate().toLocaleDateString('pl-PL')} <br/>
                          <small>{offer.createdAt.toDate().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}</small>
                        </>
                      ) : (
                        <span>Przetwarzanie...</span>
                      )}
                    </td>

                    <td>Rocznik {offer.carYear}</td>

                    <td>
                      {offer.engineType === 'petrol' && 'Benzyna'}
                      {offer.engineType === 'diesel' && 'Diesel'}
                      {offer.engineType === 'hybrid' && 'Hybryda'}
                      {offer.engineType === 'electric' && 'Elektryczny'}
                    </td>

                    <td>
                      <span className="price-cell">{offer.price} PLN</span>
                    </td>

                    <td>
                      <PDFDownloadLink 
                        document={<OfferDocument data={offer} />} 
                        fileName={`Oferta_Ubezpieczenia_${offer.carYear}.pdf`}
                        style={{ textDecoration: 'none' }}
                      >
                        {({ loading: pdfLoading }) => (
                          <button 
                            className="btn-outline" 
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '0.8rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              cursor: 'pointer'
                            }}
                            disabled={pdfLoading}
                          >
                            <FileText size={16} />
                            {pdfLoading ? 'Generuję...' : 'Pobierz PDF'}
                          </button>
                        )}
                      </PDFDownloadLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;