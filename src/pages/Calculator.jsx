import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Calculator = () => {
  const { user } = useAuth();
  
  const popularBrands = ["ALFA ROMEO", "AUDI", "BMW", "CITROEN", "DACIA", "FIAT", "FORD", "HONDA", "HYUNDAI", "JEEP", "KIA", "MAZDA", "MERCEDES-BENZ", "NISSAN", "OPEL", "PEUGEOT", "RENAULT", "SEAT", "SKODA", "TOYOTA", "VOLKSWAGEN", "VOLVO"];
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
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', pesel: '', zipCode: '', birthDate: '',
    brand: '', model: '', carYear: '', engineCapacity: '',
    enginePower: '', engineType: 'PETROL', mileage: '',
    variants: { oc: true, ac: false, nnw: false },
    assistance: false, windowProtection: false, tireProtection: false, discountProtection: false
  });

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    return 2026 - new Date(birthDate).getFullYear();
  };

  useEffect(() => {
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
      .then(res => res.json())
      .then(data => {
        if (data.Results) {
          const apiMakes = data.Results.map(item => item.MakeName.toUpperCase().trim());
          setBrands([...new Set([...popularBrands, ...apiMakes])].sort());
        }
      }).catch(() => console.log("API offline"));
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
          if (data.Results) setModels(prev => [...new Set([...prev, ...data.Results.map(item => item.Model_Name.toUpperCase().trim())])].sort());
          setLoadingModels(false);
        }).catch(() => setLoadingModels(false));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name.startsWith('variant_')) {
        setFormData(prev => ({ ...prev, variants: { ...prev.variants, [name.replace('variant_', '')]: checked } }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase ? value.toUpperCase() : value }));
    }
  };

  const calculateProbablePrice = (e) => {
    e.preventDefault();
    const age = calculateAge(formData.birthDate);
    if (!age || age < 18) return toast.error("Minimalny wiek ubezpieczającego to 18 lat");

    const yearFactor = (2026 - parseInt(formData.carYear)) * 15;
    const powerFactor = parseInt(formData.enginePower) * 1.5;
    const fuelFactor = formData.engineType === 'DIESEL' ? 50 : formData.engineType === 'LPG' ? 80 : 0;
    const youngFactor = age < 26 ? 600 : 0;
    
    const extras = (formData.variants.ac ? 500 : 0) + (formData.variants.nnw ? 100 : 0);
    const addonsCost = (formData.assistance ? 150 : 0) + (formData.windowProtection ? 80 : 0) + (formData.tireProtection ? 50 : 0) + (formData.discountProtection ? 200 : 0);

    setResult(Math.round(400 + yearFactor + powerFactor + fuelFactor + youngFactor + extras + addonsCost));
    setIsSent(false);
  };

  const sendForExactQuote = async () => {
    if (!user) return toast.error("Zaloguj się!");
    try {
      await addDoc(collection(db, 'quotes'), { ...formData, age: calculateAge(formData.birthDate), probablePrice: result, userEmail: user.email, status: 'new', createdAt: serverTimestamp() });
      setIsSent(true);
      toast.success("Wysłano do analizy rynkowej!");
    } catch { toast.error("Błąd zapisu."); }
  };

  return (
    <div className="container anim-slide-up" style={{ padding: '40px 20px' }}>
      <div className="section-title">
        <h2>Kalkulator Ubezpieczeń</h2>
        <p>Wprowadź dane ubezpieczającego i pojazdu.</p>
      </div>

      <div className="calc-form">
        <form onSubmit={calculateProbablePrice}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Dane Właściciela</h3>
          <div className="form-grid">
            <div className="form-group"><label>Imię</label><input type="text" name="firstName" onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Nazwisko</label><input type="text" name="lastName" onChange={handleInputChange} required /></div>
            <div className="form-group"><label>PESEL</label><input type="text" name="pesel" maxLength="11" onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Kod pocztowy</label><input type="text" name="zipCode" onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Data urodzenia</label><input type="date" name="birthDate" onChange={handleInputChange} required /></div>
          </div>

          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Dane Pojazdu</h3>
          <div className="form-grid">
            <div className="form-group"><label>Marka</label><select name="brand" value={formData.brand} onChange={handleBrandChange} required><option value="">-- Wybierz --</option>{brands.map((b, i) => <option key={i} value={b}>{b}</option>)}</select></div>
            <div className="form-group"><label>Model</label><select name="model" value={formData.model} onChange={handleInputChange} disabled={!formData.brand} required><option value="">{loadingModels ? "Ładowanie..." : "-- Wybierz --"}</option>{models.map((m, i) => <option key={i} value={m}>{m}</option>)}</select></div>
            <div className="form-group"><label>Rok produkcji</label><input type="number" name="carYear" onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Moc (kW)</label><input type="number" name="enginePower" onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Rodzaj paliwa</label><select name="engineType" value={formData.engineType} onChange={handleInputChange} required><option value="PETROL">Benzyna</option><option value="DIESEL">Diesel</option><option value="LPG">Benzyna+LPG</option><option value="HYBRID">Hybryda</option><option value="ELECTRIC">Elektryczny</option></select></div>
            <div className="form-group"><label>Pojemność (cm3)</label><input type="number" name="engineCapacity" onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Przebieg (km)</label><input type="number" name="mileage" onChange={handleInputChange} required /></div>
          </div>

          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Warianty Płatne</h3>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
             <label className="custom-checkbox"><input type="checkbox" checked disabled /><span className="checkmark"></span><span className="label-text">OC</span></label>
             <label className="custom-checkbox"><input type="checkbox" name="variant_ac" onChange={handleInputChange} /><span className="checkmark"></span><span className="label-text">AC</span></label>
             <label className="custom-checkbox"><input type="checkbox" name="variant_nnw" onChange={handleInputChange} /><span className="checkmark"></span><span className="label-text">NNW</span></label>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Dodatki do ubezpieczenia:</label>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
               <label className="custom-checkbox"><input type="checkbox" name="assistance" onChange={handleInputChange} /><span className="checkmark"></span><span className="label-text">Assistance</span></label>
               <label className="custom-checkbox"><input type="checkbox" name="windowProtection" onChange={handleInputChange} /><span className="checkmark"></span><span className="label-text">Ochrona Szyb</span></label>
               <label className="custom-checkbox"><input type="checkbox" name="tireProtection" onChange={handleInputChange} /><span className="checkmark"></span><span className="label-text">Ochrona Opon</span></label>
               <label className="custom-checkbox"><input type="checkbox" name="discountProtection" onChange={handleInputChange} /><span className="checkmark"></span><span className="label-text">Ochrona Zniżek</span></label>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '40px', width: '100%' }}>Oblicz składkę</button>
        </form>
      </div>

      {result && (
        <div className="auth-card anim-slide-up" style={{ margin: '50px auto', maxWidth: '900px', textAlign: 'center', background: 'var(--bg-secondary)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3>Szacunkowa składka: <span style={{ color: 'var(--primary)' }}>{result} PLN</span></h3>
          <p>Wiek ubezpieczającego: <strong>{calculateAge(formData.birthDate)} lat</strong></p>
          {!isSent ? (
            <button onClick={sendForExactQuote} className="btn-primary" style={{ width: 'auto', padding: '14px 60px', marginTop: '20px' }}>Poproś o analizę rynkową</button>
          ) : (
            <div style={{ color: '#22c55e', fontWeight: 'bold', marginTop: '20px' }}>✓ Zapytanie wysłane!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;