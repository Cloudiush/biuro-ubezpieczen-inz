import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Trash2, MessageSquare, FileText } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [offers, setOffers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "admin@admin.com"; 

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      navigate('/'); 
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const offersQ = query(collection(db, "offers"), orderBy("createdAt", "desc"));
      const offersSnap = await getDocs(offersQ);
      setOffers(offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const msgsQ = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const msgsSnap = await getDocs(msgsQ);
      setMessages(msgsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error("Błąd pobierania:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Czy na pewno usunąć ten element?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        if (collectionName === "offers") {
          setOffers(prev => prev.filter(item => item.id !== id));
        } else {
          setMessages(prev => prev.filter(item => item.id !== id));
        }
      } catch (error) {
        alert("Błąd: " + error.message);
      }
    }
  };

  if (loading) return <div className="container" style={{textAlign: 'center', marginTop: '50px'}}>Ładowanie Panelu...</div>;

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div style={{ backgroundColor: '#ffe4e6', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #fda4af' }}>
        <h1 style={{ color: '#881337', margin: 0, fontSize: '2rem' }}>Panel Administratora 🛡️</h1>
        <p style={{ color: '#9f1239', marginTop: '5px' }}>Zalogowany jako: <strong>{user?.email}</strong></p>
      </div>

      <div className="profile-content" style={{ marginBottom: '40px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare color="var(--secondary)" /> Wiadomości z formularza ({messages.length})
        </h2>
        
        {messages.length === 0 ? (
          <p style={{ color: 'gray', fontStyle: 'italic' }}>Brak nowych wiadomości.</p>
        ) : (
          <div className="table-responsive">
            <table className="offers-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Od</th>
                  <th>Temat</th>
                  <th>Treść</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id}>
                    <td style={{ minWidth: '100px', fontSize: '0.9rem' }}>
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString('pl-PL') : '-'}
                    </td>
                    <td>
                      <strong>{msg.name}</strong><br/>
                      <small style={{ color: 'var(--text-muted)' }}>{msg.email}</small>
                    </td>
                    <td>{msg.subject}</td>
                    <td style={{ maxWidth: '300px', fontSize: '0.9rem' }}>{msg.message}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete("messages", msg.id)}
                        className="btn-outline"
                        style={{ color: 'red', borderColor: 'red', padding: '5px' }}
                        title="Usuń wiadomość"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="profile-content">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText color="var(--secondary)" /> Zapisane Oferty ({offers.length})
        </h2>
        
        <div className="table-responsive">
          <table className="offers-table">
            <thead>
              <tr>
                <th>Klient</th>
                <th>Data</th>
                <th>Samochód</th>
                <th>Cena</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td>{offer.email}</td>
                  <td>{offer.createdAt?.toDate ? offer.createdAt.toDate().toLocaleDateString('pl-PL') : '-'}</td>
                  <td>{offer.carYear} ({offer.engineType})</td>
                  <td className="price-cell">{offer.price} PLN</td>
                  <td>
                    <button 
                      onClick={() => handleDelete("offers", offer.id)}
                      className="btn-outline"
                      style={{ color: 'red', borderColor: 'red', padding: '5px' }}
                      title="Usuń ofertę"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;