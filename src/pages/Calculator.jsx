import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Calculator = () => {
  const { user } = useAuth();
  
  const popularBrands = [
    "ALFA ROMEO", "AUDI", "BMW", "CITROEN", "DACIA", "FIAT", "FORD", "HONDA", 
    "HYUNDAI", "JEEP", "KIA", "MAZDA", "MERCEDES-BENZ", "NISSAN", "OPEL", 
    "PEUGEOT", "RENAULT", "SEAT", "SKODA", "TOYOTA", "VOLKSWAGEN", "VOLVO"
  ];

  const fallbackModels = {
    "VOLKSWAGEN": ["GOLF", "PASSAT", "TIGUAN", "POLO", "TOURAN", "EOS", "ARTEON"],
    "TOYOTA": ["COROLLA", "YARIS", "RAV4", "AURIS", "AYGO", "CH-R"],
    "SKODA": ["OCTAVIA", "FABIA", "SUPERB", "KODIAQ", "KAROQ"],
    "AUDI": ["A3", "A4", "A6", "Q5", "A5", "Q7"]
  };

  const [brands, setBrands] = useState(popularBrands);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', pesel: '', zipCode: '', birthDate: '',
    brand: '', model: '', carYear: '', engineCapacity: '',
    enginePower: '', engineType: 'PETROL', mileage: '',
    variants: { oc: true, ac: false, nnw: false }
  });
  
  const [result, setResult] = useState(null);

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const targetYear = 2026;
    return targetYear - birth.getFullYear();
  };

  useEffect(() => {
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
      .then(res => res.json())
      .then(data => {
        if (data.Results) {
          const apiMakes = data.Results.map(item => item.MakeName.toUpperCase().trim());
          const combinedBrands = [...new Set([...popularBrands, ...apiMakes])];
          setBrands(combinedBrands.sort());
        }
      })
      .catch(() => console.log("API offline"));
  }, []);

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, brand: selectedBrand, model: '' }));
    setModels(fallbackModels[selectedBrand] || []);
    
    if (selectedBrand) {
      setLoadingModels(true);
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(selectedBrand)}?format=json`)
        .then(res => res.json())
        .then(data => {
          if (data.Results) {
            const apiModels = data.Results.map(item => item.Model_Name.toUpperCase().trim());
            setModels(prev => [...new Set([...prev, ...apiModels])].sort());
          }
          setLoadingModels(false);
        })
        .catch(() => setLoadingModels(false));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const variantKey = name.replace('variant_', '');
      setFormData(prev => ({
        ...prev,
        variants: { ...prev.variants, [variantKey]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase ? value.toUpperCase() : value }));
    }
  };

  const calculateProbablePrice = (e) => {
    e.preventDefault();
    const age = calculateAge(formData.birthDate);
    if (!age || age < 17) return toast.error("Minimalny wiek ubezpieczającego to 17 lat");

    let base = 400;
    const yearFactor = (2026 - parseInt(formData.carYear)) * 15;
    const powerFactor = parseInt(formData.enginePower) * 1.5;
    
    let fuelFactor = 0;
    if (formData.engineType === 'DIESEL') fuelFactor = 50;
    if (formData.engineType === 'LPG') fuelFactor = 80;

    const youngFactor = age < 26 ? 600 : 0;
    const extras = (formData.variants.ac ? 500 : 0) + (formData.variants.nnw ? 100 : 0);

    setResult(Math.round(base + yearFactor + powerFactor + fuelFactor + youngFactor + extras));
    setIsSent(false);
  };

  const sendForExactQuote = async () => {
    if (!user) return toast.error("Zaloguj się!");
    try {
      await addDoc(collection(db, 'quotes'), {
        ...formData,
        age: calculateAge(formData.birthDate),
        probablePrice: result,
        userEmail: user.email,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setIsSent(true);
      toast.success("Wysłano do analizy rynkowej!");
    } catch {
      toast.error("Błąd zapisu.");
    }
  };

  return (
    <div className="container anim-slide-up" style={{ padding: '40px 20px' }}>
      <div className="section-title">
        <h1>Kalkulator Ubezpieczeń</h1>
        <p>Wprowadź dane ubezpieczającego i pojazdu.</p>
      </div>

      <div className="calc-form" style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--bg-secondary)', padding: '40px', border: '1px solid var(--border-color)' }}>
        <form onSubmit={calculateProbablePrice}>
          
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Dane Właściciela</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Wiersz 1 */}
            <input type="text" name="firstName" placeholder="Imię" onChange={handleInputChange} required />
            <input type="text" name="lastName" placeholder="Nazwisko" onChange={handleInputChange} required />
            
            {/* Wiersz 2 - Teraz PESEL jest obok Kodu pocztowego, oba mają tę samą wysokość */}
            <input type="text" name="pesel" placeholder="PESEL" maxLength="11" onChange={handleInputChange} required />
            <input type="text" name="zipCode" placeholder="Kod pocztowy" onChange={handleInputChange} required />
            
            {/* Wiersz 3 - Data urodzenia (wyższa przez label) jest teraz sama */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Data urodzenia</label>
              <input type="date" name="birthDate" onChange={handleInputChange} required />
            </div>
          </div>

          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Dane Pojazdu</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <select name="brand" value={formData.brand} onChange={handleBrandChange} required>
              <option value="">-- Marka --</option>
              {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
            
            <select name="model" value={formData.model} onChange={handleInputChange} disabled={!formData.brand} required>
              <option value="">{loadingModels ? "Ładowanie..." : "-- Model --"}</option>
              {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
            </select>

            <input type="number" name="carYear" placeholder="Rok produkcji" onChange={handleInputChange} required />
            <input type="number" name="enginePower" placeholder="Moc (kW)" onChange={handleInputChange} required />
            
            <select name="engineType" value={formData.engineType} onChange={handleInputChange} required>
              <option value="PETROL">Benzyna</option>
              <option value="DIESEL">Diesel</option>
              <option value="LPG">Benzyna+LPG</option>
              <option value="HYBRID">Hybryda</option>
              <option value="ELECTRIC">Elektryczny</option>
            </select>

            <input type="number" name="engineCapacity" placeholder="Pojemność (cm3)" onChange={handleInputChange} required />
            <input type="number" name="mileage" placeholder="Przebieg (km)" onChange={handleInputChange} required />
          </div>

          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Warianty</h3>
          <div style={{ display: 'flex', gap: '30px' }}>
             <label><input type="checkbox" checked disabled /> OC (Obowiązkowe)</label>
             <label><input type="checkbox" name="variant_ac" onChange={handleInputChange} /> AC</label>
             <label><input type="checkbox" name="variant_nnw" onChange={handleInputChange} /> NNW</label>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '40px' }}>Oblicz składkę</button>
        </form>
      </div>

      {result && (
        <div className="auth-card anim-slide-up" style={{ margin: '50px auto', maxWidth: '900px', textAlign: 'center' }}>
          <h3>Szacunkowa składka: <span style={{ color: 'var(--primary)' }}>{result} PLN</span></h3>
          <p>Wiek ubezpieczającego: <strong>{calculateAge(formData.birthDate)} lat</strong></p>
          {!isSent ? (
            <button onClick={sendForExactQuote} className="btn-primary" style={{ width: 'auto', padding: '14px 60px', marginTop: '20px' }}>
              Poproś o analizę rynkową
            </button>
          ) : (
            <div style={{ color: '#22c55e', fontWeight: 'bold', marginTop: '20px' }}>✓ Zapytanie wysłane!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;