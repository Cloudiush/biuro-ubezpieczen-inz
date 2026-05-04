import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      await signup(data.email, data.password);
      navigate("/"); 
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError("Ten email jest już zajęty.");
      } else {
        setAuthError("Błąd rejestracji. Hasło musi mieć min. 6 znaków.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit(onSubmit)} className="calc-form" style={{ width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Załóż konto</h2>
          <p style={{ color: 'var(--text-muted)' }}>Dołącz do nas 🚀</p>
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
          <input type="email" {...register("email", { required: true })} placeholder="twoj@email.com" />
        </div>

        <div className="form-group">
          <label>Hasło (min. 6 znaków)</label>
          <input type="password" {...register("password", { required: true, minLength: 6 })} placeholder="••••••" />
          {errors.password && <span className="error-msg">Hasło za krótkie</span>}
        </div>

        <div className="form-group">
          <label>Powtórz hasło</label>
          <input 
            type="password" 
            placeholder="••••••"
            {...register("confirmPassword", { 
              validate: (val) => {
                if (watch('password') != val) return "Hasła nie są identyczne";
              }
            })} 
          />
          {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <UserPlus size={18} /> Zarejestruj się
        </button>
        
        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.95rem' }}>
          Masz już konto? <Link to="/logowanie" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Zaloguj się</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;