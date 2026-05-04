import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { calculatePremium } from '../utils/calculateOc';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const currentYear = 2026;
const YEARS = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

const schema = yup.object({
  carYear: yup.number().typeError('Wybierz rok').required('Wymagane'),
  driverAge: yup.number().typeError('Podaj wiek').min(18, 'Min. 18 lat').max(99).required('Wymagane'),
  engineType: yup.string().required('Wybierz paliwo'),
  engineCapacity: yup.string().test('is-required', 'Wybierz pojemność', function(value) {
      const { engineType } = this.parent;
      if (engineType === 'electric') return true;
      return !!value;
    }),
  safeDrivingYears: yup.number().min(0).max(60).required(),
  insuranceType: yup.string().required('Wybierz pakiet')
}).required();

const Calculator = () => {
  const [result, setResult] = useState(null);
  const [savedId, setSavedId] = useState(null);
  
  const { user } = useAuth();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const selectedEngineType = watch("engineType");

  const onSubmit = async (data) => {
    const calculatedPrice = calculatePremium(data);
    setResult(calculatedPrice);
    setSavedId(null);

    if (user) {
      try {
        const docRef = await addDoc(collection(db, "offers"), {
          uid: user.uid,
          email: user.email,
          price: calculatedPrice,
          carYear: data.carYear,
          engineType: data.engineType,
          createdAt: serverTimestamp()
        });
        setSavedId(docRef.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const preventMinus = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Kalkulator OC/AC</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {user ? 
            <span>Zalogowany jako: <strong>{user.email}</strong>. Twoja oferta zostanie zapisana.</span> 
            : "Zaloguj się, aby zapisać historię wycen."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="calc-form">
        
        <div className="form-group">
          <label>Rok produkcji pojazdu</label>
          <select {...register("carYear")}>
            <option value="">-- Wybierz rok --</option>
            {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
          <p className="error-msg">{errors.carYear?.message}</p>
        </div>

        <div className="form-group">
          <label>Wiek kierowcy</label>
          <input 
            type="number" 
            {...register("driverAge")} 
            placeholder="np. 28" 
            min="0" 
            onKeyDown={preventMinus} 
            className="no-spinners"
          />
          <p className="error-msg">{errors.driverAge?.message}</p>
        </div>

        <div className="form-group">
          <label>Rodzaj silnika / Paliwo</label>
          <select {...register("engineType")}>
            <option value="">-- Wybierz --</option>
            <option value="petrol">⛽ Benzyna</option>
            <option value="diesel">⚫ Diesel (ON)</option>
            <option value="hybrid">🔋 Hybryda</option>
            <option value="electric">⚡ Elektryczny</option>
          </select>
          <p className="error-msg">{errors.engineType?.message}</p>
        </div>

        {selectedEngineType && selectedEngineType !== 'electric' && (
          <div className="form-group" style={{ animation: 'fadeIn 0.5s' }}>
            <label>Pojemność silnika</label>
            <select {...register("engineCapacity")}>
              <option value="">-- Wybierz --</option>
              <option value="1.0">do 1.2L</option>
              <option value="1.6">1.3L - 1.6L</option>
              <option value="2.0">1.7L - 2.0L</option>
              <option value="3.0">2.1L - 3.0L</option>
              <option value="4.0">Powyżej 3.0L</option>
            </select>
            <p className="error-msg">{errors.engineCapacity?.message}</p>
          </div>
        )}

        <div className="form-group">
          <label>Lata bezszkodowej jazdy</label>
          <input 
            type="number" 
            {...register("safeDrivingYears")} 
            defaultValue={0} 
            min="0" 
            onKeyDown={preventMinus} 
            className="no-spinners"
          />
          <p className="error-msg">{errors.safeDrivingYears?.message}</p>
        </div>

        <div className="form-group">
          <label>Wybierz pakiet</label>
          <div className="radio-group">
            
            <label>
              <input type="radio" value="oc" {...register("insuranceType")} defaultChecked />
              <div>
                <strong>Tylko OC</strong><br/>
                <small style={{ color: 'var(--text-muted)' }}>Podstawowa ochrona prawna</small>
              </div>
            </label>

            <label>
              <input type="radio" value="ac" {...register("insuranceType")} />
              <div>
                <strong>Pakiet OC + AC (+50%)</strong><br/>
                <small style={{ color: 'var(--text-muted)' }}>Ochrona przed kradzieżą i uszkodzeniami</small>
              </div>
            </label>

            <label style={{ 
              border: '2px solid var(--secondary)', 
              backgroundColor: 'rgba(37, 99, 235, 0.03)' 
            }}>
              <input type="radio" value="premium" {...register("insuranceType")} />
              <div>
                <strong style={{ color: 'var(--secondary)' }}>Full Premium VIP (+100%)</strong>
                <br/>
                <small style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginTop: '8px', lineHeight: '1.6' }}>
                  Pełne AutoCasco (All Risk)<br/>
                  Assistance Europa (Hotel + Laweta)<br/>
                  Ubezpieczenie Opon i Szyb<br/>
                  Auto Zastępcze na 14 dni
                </small>
              </div>
            </label>

          </div>
          <p className="error-msg">{errors.insuranceType?.message}</p>
        </div>

        <button type="submit" className="btn-primary">Przelicz składkę</button>
      </form>

      {result && (
        <div className="result-box anim-pop">
          <h2 style={{ marginBottom: '10px' }}>Twoja składka:</h2>
          <span className="price" style={{ fontSize: '2.5rem', display: 'block', margin: '15px 0' }}>
            {result} PLN / rok
          </span>
          
          {user && savedId && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: '#dcfce7', 
              color: '#166534', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
            Oferta została zapisana w Twoim profilu!
            </div>
          )}
          
          {!user && (
            <p style={{ marginTop: '15px' }}>
              <a href="/logowanie" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Zaloguj się</a>, aby zapisać tę ofertę.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;