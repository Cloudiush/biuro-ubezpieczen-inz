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

  const cardStyle = {
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid var(--text-muted, #555)',
    fontSize: '1rem',
    width: '100%',
    marginBottom: '15px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    display: 'block'
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--secondary)' }}>Skontaktuj się z nami</h1>
        <p style={{ color: 'var(--text-muted)' }}>Masz pytania dotyczące polisy? Jesteśmy do Twojej dyspozycji 24/7.</p>
      </div>

      <div className="anim-slide-up" style={cardStyle}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Napisz wiadomość</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Imię i Nazwisko</label>
          <input 
            type="text" 
            required 
            style={inputStyle} 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Adres Email</label>
          <input 
            type="email" 
            required 
            style={inputStyle} 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Temat</label>
          <select 
            style={inputStyle}
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
            style={{ ...inputStyle, resize: 'vertical' }}
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