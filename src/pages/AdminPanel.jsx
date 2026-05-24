import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import OfferDocument from '../components/pdf/OfferDocument'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('quotes');
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotesSnap = await getDocs(collection(db, 'quotes'));
        setQuotes(quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        toast.error("Błąd pobierania zapytań o ofertę.");
      }

      try {
        const contactsSnap = await getDocs(collection(db, 'contacts'));
        setContactMessages(contactsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        toast.error("Błąd pobierania wiadomości kontaktowych.");
      }
    };
    fetchData();
  }, []);

  const handleSelectQuote = (q) => {
    setSelectedQuote(q);
    setFinalPrice(q.probablePrice || '');
    setAdminMessage(`Dzień dobry ${q.firstName},\n\nPrzygotowałem ofertę ubezpieczenia dla auta ${q.brand} ${q.model}. Szczegóły znajdziesz w załączonym dokumencie PDF.\n\nPozdrawiam!`);
  };

  const handleSendFullOffer = async () => {
    if (!selectedQuote) return;
    setLoading(true);
    const toastId = toast.loading("Generowanie i wysyłanie oferty...");

    try {
      const input = document.getElementById('offer-document-template');
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      const storageRef = ref(storage, `offers/Oferta_${selectedQuote.id}_${Date.now()}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      const pdfUrl = await getDownloadURL(storageRef);

      try {
        await addDoc(collection(db, "offers"), {
          uid: selectedQuote.uid || "",
          email: selectedQuote.userEmail || "",
          carBrand: selectedQuote.brand || "",
          carModel: selectedQuote.model || "",
          carYear: selectedQuote.carYear || "",
          engineType: selectedQuote.engineType || "",
          price: finalPrice || "",
          pdfUrl: pdfUrl || "",
          createdAt: serverTimestamp()
        });
      } catch (dbErr) {
        console.error("Błąd zapisu rekordu oferty w Firestore:", dbErr);
      }

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: selectedQuote.userEmail,
          to_name: selectedQuote.firstName,
          message: `${adminMessage}\n\nLink do Twojej oferty PDF: ${pdfUrl}`,
        }, 
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.update(toastId, { render: "Oferta wysłana!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      toast.update(toastId, { render: "Błąd wysyłki oferty.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = (msg) => {
    setSelectedContact(msg);
    setReplyText(`Dzień dobry ${msg.name || ''},\n\nW odpowiedzi na Twoją wiadomość:\n\n\n\nPozdrawiam,\nBiuro Ubezpieczeń`);
  };

  const handleSendReply = async () => {
    if (!selectedContact) return;
    setLoading(true);
    const toastId = toast.loading("Wysyłanie odpowiedzi...");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: selectedContact.email,
          to_name: selectedContact.name || 'Klient',
          message: replyText
        }, 
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.update(toastId, { render: "Odpowiedź wysłana!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      toast.update(toastId, { render: "Błąd wysyłki.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container admin-container">
      <h1 className="section-title">Panel Administratora</h1>
      
      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('quotes')} 
          className={`admin-tab-btn ${activeTab === 'quotes' ? 'active quotes' : ''}`}
        >
          Zapytania o ofertę
        </button>
        <button 
          onClick={() => setActiveTab('messages')} 
          className={`admin-tab-btn ${activeTab === 'messages' ? 'active messages' : ''}`}
        >
          Wiadomości z formularza
        </button>
      </div>

      {activeTab === 'quotes' && (
        <div className="admin-layout anim-fade-in">
          <div>
            {quotes.length === 0 && <p className="empty-state">Brak zapytań o ofertę.</p>}
            {quotes.map(q => (
              <div 
                key={q.id} 
                onClick={() => handleSelectQuote(q)} 
                className={`admin-list-item ${selectedQuote?.id === q.id ? 'active quote-item' : ''}`}
              >
                <strong>{q.firstName} {q.lastName}</strong>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Wycena bazy: {q.probablePrice} PLN</div>
              </div>
            ))}
          </div>

          <div className="admin-details-panel">
            {selectedQuote ? (
              <div className="anim-slide-up">
                <h2 className="details-header quote-header">
                  Wycena dla: <span style={{ opacity: 0.9 }}>{selectedQuote.firstName} {selectedQuote.lastName}</span>
                </h2>
                
                <div className="info-grid">
                  <div>
                    <p className="info-label">Dane Klienta</p>
                    <p>PESEL: <strong>{selectedQuote.pesel}</strong></p>
                    <p>Kod pocztowy: <strong>{selectedQuote.zipCode}</strong></p>
                    <p>Wiek: <strong>{selectedQuote.age} lat</strong></p>
                  </div>
                  <div>
                    <p className="info-label">Dane Pojazdu</p>
                    <p>Auto: <strong>{selectedQuote.brand} {selectedQuote.model} ({selectedQuote.carYear})</strong></p>
                    <p>Silnik: <strong>{selectedQuote.engineCapacity} cm3, {selectedQuote.enginePower} kW</strong></p>
                    <p>Paliwo: <strong>{selectedQuote.engineType}</strong></p>
                    <p>Przebieg: <strong>{selectedQuote.mileage} km</strong></p>
                  </div>
                </div>

                <div className="variants-box">
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Wybrane pakiety i dodatki:</p>
                  <div className="badges-container">
                    <span className="badge-green">OC</span>
                    {selectedQuote.variants?.ac && <span className="badge-green">AC</span>}
                    {(selectedQuote.nnw || selectedQuote.assistance || selectedQuote.windowProtection || selectedQuote.tireProtection || selectedQuote.discountProtection) && (
                      <div className="badge-divider"></div>
                    )}
                    {selectedQuote.nnw && <span className="badge-blue">NNW</span>}
                    {selectedQuote.assistance && <span className="badge-blue">Assistance</span>}
                    {selectedQuote.windowProtection && <span className="badge-blue">Ochrona Szyb</span>}
                    {selectedQuote.tireProtection && <span className="badge-blue">Ochrona Opon</span>}
                    {selectedQuote.discountProtection && <span className="badge-blue">Ochrona Zniżek</span>}
                  </div>
                </div>

                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ostateczna wycena (PLN):</label>
                <input 
                  type="number" 
                  value={finalPrice} 
                  onChange={(e) => setFinalPrice(e.target.value)} 
                  className="price-input" 
                />
                
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Wiadomość:</label>
                <textarea 
                  rows="5" 
                  value={adminMessage} 
                  onChange={(e) => setAdminMessage(e.target.value)} 
                  className="admin-textarea" 
                />

                <button 
                  onClick={handleSendFullOffer} 
                  disabled={loading} 
                  className="btn-primary btn-large"
                >
                  {loading ? 'Przetwarzanie...' : 'Wyślij ofertę z PDF'}
                </button>
              </div>
            ) : <div className="empty-state">Wybierz zapytanie z listy.</div>}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="admin-layout anim-fade-in">
          <div>
            {contactMessages.length === 0 && <p className="empty-state">Brak nowych wiadomości.</p>}
            {contactMessages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectContact(msg)} 
                className={`admin-list-item ${selectedContact?.id === msg.id ? 'active message-item' : ''}`}
              >
                <strong>{msg.name || msg.email}</strong>
              </div>
            ))}
          </div>

          <div className="admin-details-panel">
            {selectedContact ? (
              <div className="anim-slide-up">
                <h2 className="details-header message-header">
                  Odpowiedź do: <span style={{ opacity: 0.9 }}>{selectedContact.email}</span>
                </h2>
                
                <div className="message-box">
                  <p className="info-label" style={{ marginBottom: '10px' }}>Treść zapytania:</p>
                  <p style={{ fontStyle: 'italic', margin: 0 }}>"{selectedContact.message}"</p>
                </div>
                
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Twoja odpowiedź:</label>
                <textarea 
                  rows="8" 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
                  className="admin-textarea" 
                />
                
                <button 
                  onClick={handleSendReply} 
                  disabled={loading} 
                  className="btn-success"
                >
                  {loading ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
                </button>
              </div>
            ) : <div className="empty-state">Wybierz wiadomość z listy.</div>}
          </div>
        </div>
      )}

      {selectedQuote && (
        <div style={{ position: 'fixed', left: '-5000px', top: 0, pointerEvents: 'none' }}>
          <OfferDocument quote={{ ...selectedQuote, probablePrice: finalPrice }} id="offer-document-template" />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;