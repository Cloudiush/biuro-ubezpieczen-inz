import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import OfferDocument from '../components/pdf/OfferDocument'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

const AdminPanel = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quotes'));
        setQuotes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        toast.error("Błąd pobierania bazy danych.");
      }
    };
    fetchQuotes();
  }, []);

  const handleSelect = (q) => {
    setSelectedQuote(q);
    setFinalPrice(q.probablePrice || '');
    setAdminMessage(`Dzień dobry ${q.firstName},\n\nPrzygotowałem ostateczną ofertę ubezpieczenia dla auta ${q.brand} ${q.model}. Szczegóły znajdziesz w załączonym PDF.\n\nPozdrawiam!`);
  };

  const handleSendFullOffer = async () => {
    if (!selectedQuote) return;
    setLoading(true);
    const toastId = toast.loading("Generowanie i wysyłanie dokumentacji...");

    try {
      // 1. Generowanie PDF z niewidocznego szablonu
      const input = document.getElementById('offer-document-template');
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');

      // 2. Upload do wymuszonego Storage (połączenie z poprawnym bucketem)
      const storageRef = ref(storage, `offers/Oferta_${selectedQuote.id}_${Date.now()}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      const pdfUrl = await getDownloadURL(storageRef);

      // 3. Wysyłka e-mail z wygenerowanym linkiem
      await emailjs.send(
        'service_ecr5zxe', 
        'template_pxdo309', 
        {
          to_email: selectedQuote.userEmail,
          to_name: selectedQuote.firstName,
          message: `${adminMessage}\n\nLink do Twojej oferty PDF: ${pdfUrl}`,
          final_price: finalPrice
        }, 
        'lWkknHp8cLL9UjRc4'
      );

      toast.update(toastId, { render: "Oferta wysłana pomyślnie na e-mail klienta!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "Błąd podczas wysyłki: " + err.message, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="section-title">Panel Administratora</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '30px' }}>
        {/* LEWA STRONA: LISTA */}
        <div>
          {quotes.map(q => (
            <div key={q.id} onClick={() => handleSelect(q)} style={{ 
              padding: '15px', border: selectedQuote?.id === q.id ? '2px solid #2563eb' : '1px solid #ddd', 
              marginBottom: '10px', cursor: 'pointer', backgroundColor: '#fff' 
            }}>
              <strong>{q.firstName} {q.lastName}</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Wycena bazowa: {q.probablePrice} PLN</div>
            </div>
          ))}
        </div>

        {/* PRAWA STRONA: DANE, EDYCJA I WYSYŁKA */}
        <div style={{ backgroundColor: '#fff', padding: '30px', border: '1px solid #ddd' }}>
          {selectedQuote ? (
            <div className="anim-slide-up">
              <h2 style={{ borderBottom: '2px solid #2563eb', paddingBottom: '10px', marginBottom: '20px' }}>
                Wycena dla: {selectedQuote.firstName} {selectedQuote.lastName}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', background: '#f8fafc', padding: '15px' }}>
                <p>PESEL: <strong>{selectedQuote.pesel}</strong></p>
                <p>Auto: <strong>{selectedQuote.brand} {selectedQuote.model}</strong></p>
                <p>Moc/Pojemność: <strong>{selectedQuote.enginePower} kW / {selectedQuote.engineCapacity} cm3</strong></p>
                <p>Przebieg: <strong>{selectedQuote.mileage} km</strong></p>
              </div>

              <label style={{ fontWeight: 'bold' }}>Ostateczna wycena (PLN):</label>
              <input 
                type="number" 
                value={finalPrice} 
                onChange={(e) => setFinalPrice(e.target.value)} 
                style={{ display: 'block', width: '200px', marginBottom: '20px', padding: '12px', border: '2px solid #2563eb', fontWeight: 'bold', fontSize: '1.1rem' }} 
              />
              
              <label style={{ fontWeight: 'bold' }}>Wiadomość w mailu:</label>
              <textarea 
                rows="5" 
                value={adminMessage} 
                onChange={(e) => setAdminMessage(e.target.value)} 
                style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc' }} 
              />

              <button 
                onClick={handleSendFullOffer} 
                disabled={loading} 
                className="btn-primary" 
                style={{ width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                {loading ? 'Przetwarzanie dokumentu i wysyłanie...' : 'Wyślij ofertę z PDF e-mailem'}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
              Wybierz zapytanie z listy po lewej, aby rozpocząć wycenę.
            </div>
          )}
        </div>
      </div>

      {/* UKRYTY SZABLON PDF - wyłączone zdarzenia myszy zapobiegają blokowaniu UI */}
      {selectedQuote && (
        <div style={{ position: 'fixed', left: '-5000px', top: 0, pointerEvents: 'none' }}>
          <OfferDocument quote={{ ...selectedQuote, probablePrice: finalPrice }} id="offer-document-template" />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;