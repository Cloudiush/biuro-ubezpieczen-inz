import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Hasła nie są identyczne!");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        role: 'user',
        createdAt: new Date()
      });
      toast.success("Konto utworzone!");
      navigate('/');
    } catch (error) {
      toast.error("Hasło jest za krótkie.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card anim-slide-up">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Załóż konto</h2>
        <p style={{ color: 'var(--text-muted)' }}>Dołącz do nas</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Email</label>
            <input 
              type="email" 
              placeholder="twoj@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Hasło (min. 6 znaków)</label>
            <input 
              type="password" 
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Powtórz hasło</label>
            <input 
              type="password" 
              placeholder="••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
            Zarejestruj się
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Masz już konto? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Zaloguj się</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;