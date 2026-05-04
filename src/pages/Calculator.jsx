import { useState, useEffect } from 'react';

const popularBrands = [
  "Audi", "BMW", "Fiat", "Ford", "Honda", "Hyundai", "Kia", 
  "Mazda", "Mercedes-Benz", "Opel", "Peugeot", "Renault", 
  "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo"
];

const Calculator = () => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    brand: 'Toyota',
    carModel: '',
    year: '2015',
    engine: '1600',
    driverAge: '30',
    licenseYear: (currentYear - 5).toString(),
    claims: '0'
  });
  
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${formData.brand}?format=json`);
        const data = await response.json();
        const uniqueModels = [...new Set(data.Results.map(item => item.Model_Name))].sort();
        setModels(uniqueModels);
        if (uniqueModels.length > 0) setFormData(prev => ({ ...prev, carModel: uniqueModels[0] }));
      } catch (error) {
        setModels(["Brak danych"]);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, [formData.brand]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const minLicenseYear = currentYear - parseInt(formData.driverAge || 0) + 18;
  const isLicenseValid = parseInt(formData.licenseYear) >= minLicenseYear && parseInt(formData.licenseYear) <= currentYear;

  const calculatePremium = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    setTimeout(() => {
      let basePrice = 1200;
      const carAge = currentYear - parseInt(formData.year);
      
      if (carAge <= 2) basePrice += 800;
      else if (carAge > 2 && carAge <= 8) basePrice -= 150;
      else if (carAge > 15) basePrice += 300;

      const experience = currentYear - parseInt(formData.licenseYear);
      if (parseInt(formData.driverAge) < 26) basePrice *= 1.5;
      if (experience > 10) basePrice -= 200;

      const engineSize = parseInt(formData.engine);
      if (engineSize > 2500) basePrice += 500;
      else if (engineSize > 1900) basePrice += 200;
      else if (engineSize < 1200) basePrice -= 100;

      const claimsCount = parseInt(formData.claims);
      if (claimsCount === 0) basePrice *= 0.9;
      else basePrice += (claimsCount * 400);

      if (['BMW', 'Audi', 'Mercedes-Benz', 'Volvo'].includes(formData.brand)) basePrice += 400;

      setResult(Math.round(basePrice));
      setLoading(false);
    }, 1200);
  };

  const dynamicCardStyle = {
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    textAlign: 'left'
  };

  const dynamicInputStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid var(--text-muted, #555)',
    fontSize: '1rem',
    width: '100%',
    marginBottom: '15px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="anim-slide-up" style={{ color: 'var(--secondary)', marginBottom: '10px', textAlign: 'center' }}>
        Kalkulator OC/AC
      </h1>
      <p className="anim-slide-up delay-100" style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center' }}>
        Wypełnij poniższe dane, aby otrzymać precyzyjną wycenę składki ubezpieczeniowej.
      </p>

      <div className="anim-slide-up delay-200" style={dynamicCardStyle}>
        <form onSubmit={calculatePremium}>
          <p style={{fontWeight: 'bold', marginBottom: '5px'}}>Dane Pojazdu</p>
          
          <label style={{fontSize: '0.9rem'}}>Marka pojazdu</label>
          <select name="brand" value={formData.brand} onChange={handleChange} style={dynamicInputStyle}>
            {popularBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>

          <label style={{fontSize: '0.9rem'}}>Model pojazdu</label>
          <select name="carModel" value={formData.carModel} onChange={handleChange} style={dynamicInputStyle} disabled={loadingModels}>
            {loadingModels ? <option>Pobieranie...</option> : models.map(model => <option key={model} value={model}>{model}</option>)}
          </select>

          <label style={{fontSize: '0.9rem'}}>Rok produkcji</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} style={dynamicInputStyle} />

          <label style={{fontSize: '0.9rem'}}>Poj. silnika (cm³)</label>
          <input type="number" name="engine" step="100" value={formData.engine} onChange={handleChange} style={dynamicInputStyle} />

          <p style={{fontWeight: 'bold', marginBottom: '5px', marginTop: '10px'}}>Dane Kierowcy</p>
          
          <label style={{fontSize: '0.9rem'}}>Wiek kierowcy</label>
          <input type="number" name="driverAge" value={formData.driverAge} onChange={handleChange} style={dynamicInputStyle} />

          <label style={{fontSize: '0.9rem'}}>Rok uzyskania prawa jazdy</label>
          <input 
            type="number" 
            name="licenseYear" 
            value={formData.licenseYear} 
            onChange={handleChange} 
            style={{...dynamicInputStyle, borderColor: isLicenseValid ? 'var(--text-muted, #555)' : '#ef4444'}} 
          />

          <label style={{fontSize: '0.9rem'}}>Szkody (ostatnie 5 lat)</label>
          <select name="claims" value={formData.claims} onChange={handleChange} style={dynamicInputStyle}>
            <option value="0">Brak szkód</option>
            <option value="1">1 szkoda</option>
            <option value="2">2 szkody</option>
            <option value="3">3 lub więcej</option>
          </select>

          <button type="submit" className="btn-primary" disabled={loading || !isLicenseValid} style={{width: '100%', padding: '15px', marginTop: '10px'}}>
            {loading ? 'Przetwarzanie...' : 'Oblicz składkę'}
          </button>
        </form>

        {result !== null && !loading && (
          <div className="anim-slide-up" style={{marginTop: '25px', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
            <h3 style={{margin: 0}}>Twoja szacowana składka:</h3>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', margin: '5px 0'}}>{result} PLN</p>
            <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Pojazd: {formData.brand} {formData.carModel} ({formData.year})</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;