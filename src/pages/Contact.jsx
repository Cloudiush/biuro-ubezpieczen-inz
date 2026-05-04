import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [isSent, setIsSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "messages"), {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: serverTimestamp(),
      });
      
      setIsSent(true);
      
      setTimeout(() => setIsSent(false), 5000);
      
    } catch (error) {
      console.error("Błąd wysyłania:", error);
      alert("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '100px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Skontaktuj się z nami</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Masz pytania dotyczące polisy? Jesteśmy do Twojej dyspozycji 24/7.
        </p>
      </div>

      <div className="contact-wrapper">
        
        <div className="info-box">
          <div className="info-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <MapPin color="var(--secondary)" />
              <h3>Adres siedziby</h3>
            </div>
            <p>ul. Ubezpieczeniowa 12<br/>00-001 Warszawa<br/>Piętro 3, Pokój 301</p>
          </div>
           <div className="info-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <Phone color="var(--secondary)" />
              <h3>Infolinia</h3>
            </div>
            <p>+48 123 456 789<br/>Czynne pn-pt: 8:00 - 18:00</p>
          </div>

          <div className="info-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <Mail color="var(--secondary)" />
              <h3>Email</h3>
            </div>
            <p>biuro@ubezpieczenia-inz.pl</p>
          </div>
        </div>

        <form className="contact-card" onSubmit={handleSubmit(onSubmit)}>
          <h2 style={{ marginBottom: '20px' }}>Napisz wiadomość</h2>
          
          {isSent && (
            <div style={{ 
              padding: '15px', background: '#dcfce7', color: '#166534', 
              borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' 
            }}>
              <CheckCircle size={20} /> Wiadomość została wysłana pomyślnie!
            </div>
          )}

          <div className="form-group">
            <label>Imię i Nazwisko</label>
            <input 
              {...register("name", { required: "Podaj imię" })} 
              placeholder="Jan Kowalski" 
            />
            {errors.name && <span className="error-msg">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Adres Email</label>
            <input 
              type="email" 
              {...register("email", { required: "Podaj email" })} 
              placeholder="jan@example.com" 
            />
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Temat</label>
            <select {...register("subject")}>
              <option>Zapytanie o ofertę</option>
              <option>Zgłoszenie szkody</option>
              <option>Problem techniczny</option>
              <option>Inne</option>
            </select>
          </div>

          <div className="form-group">
            <label>Treść wiadomości</label>
            <textarea 
              rows="5" 
              {...register("message", { required: "Wpisz treść wiadomości" })}
              placeholder="W czym możemy pomóc?"
            ></textarea>
            {errors.message && <span className="error-msg">{errors.message.message}</span>}
          </div>

          <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Send size={18} /> Wyślij wiadomość
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;