import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Zapytanie o ofertę',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'new',
        createdAt: serverTimestamp()
      });

      toast.success("Wiadomość została wysłana pomyślnie!");
      setFormData({ name: '', email: '', subject: 'Zapytanie o ofertę', message: '' });
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd. Spróbuj ponownie później.");
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--secondary)' }}>Skontaktuj się z nami</h1>
        <p style={{ color: 'var(--text-muted)' }}>Masz pytania dotyczące polisy? Jesteśmy do Twojej dyspozycji 24/7.</p>
      </div>

      <div className="anim-slide-up contact-card">
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Napisz wiadomość</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Imię i Nazwisko</label>
          <input 
            type="text" 
            required 
            className="contact-input" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Adres Email</label>
          <input 
            type="email" 
            required 
            className="contact-input" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Temat</label>
          <select 
            className="contact-input"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          >
            <option value="Zapytanie o ofertę">Zapytanie o ofertę</option>
            <option value="Szkoda">Zgłoszenie szkody</option>
            <option value="Inne">Inne</option>
          </select>

          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Treść wiadomości</label>
          <textarea 
            required 
            rows="5" 
            className="contact-input contact-input-textarea"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', marginTop: '10px' }}>
            Wyślij wiadomość
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;