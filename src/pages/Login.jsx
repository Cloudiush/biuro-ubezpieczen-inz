import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Zalogowano pomyślnie!");
      navigate('/');
    } catch (error) {
      toast.error("Błąd logowania. Sprawdź e-mail i hasło.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card anim-slide-up">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Zaloguj się</h1>
          <p style={{ color: 'var(--text-muted)' }}>Witamy ponownie w Biurze Ubezpieczeń</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Email</label>
            <input 
              type="email" 
              placeholder="adres@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Hasło</label>
            <input 
              type="password" 
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
            Zaloguj się
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Nie masz konta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Zarejestruj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;