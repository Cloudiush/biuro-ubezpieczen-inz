import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      await login(data.email, data.password);
      navigate("/"); 
    } catch (error) {
      console.error(error);
      setAuthError("Nieprawidłowy email lub hasło.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit(onSubmit)} className="calc-form" style={{ width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Zaloguj się</h2>
          <p style={{ color: 'var(--text-muted)' }}>Witamy ponownie 👋</p>
        </div>
        
        {authError && (
          <div style={{ 
            background: '#fee2e2', color: '#b91c1c', padding: '10px', 
            borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} /> {authError}
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email", { required: true })} placeholder="adres@email.com" />
          {errors.email && <span className="error-msg">Email wymagany</span>}
        </div>

        <div className="form-group">
          <label>Hasło</label>
          <input type="password" {...register("password", { required: true })} placeholder="••••••" />
          {errors.password && <span className="error-msg">Hasło wymagane</span>}
        </div>

        <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <LogIn size={18} /> Zaloguj się
        </button>
        
        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.95rem' }}>
          Nie masz konta? <Link to="/rejestracja" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Zarejestruj się</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;