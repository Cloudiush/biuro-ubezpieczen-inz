import React from 'react';

const fuelTypesPL = {
  'PETROL': 'Benzyna',
  'DIESEL': 'Diesel',
  'LPG': 'Gaz (LPG)',
  'EV': 'Elektryczny',
  'HYBRID': 'Hybryda'
};

const OfferDocument = ({ quote, id }) => {
  if (!quote) return null;

  const getSelectedVariants = () => {
    const variants = ['OC'];
    
    if (quote.variants?.ac) variants.push('AC');
    if (quote.nnw) variants.push('NNW');
    if (quote.assistance) variants.push('Assistance');
    if (quote.windowProtection) variants.push('Ochrona Szyb');
    if (quote.tireProtection) variants.push('Ochrona Opon');
    if (quote.discountProtection) variants.push('Ochrona Zniżek');

    return variants.join(' + ');
  };

  const selectedVariantsString = getSelectedVariants();

  return (
    <div 
      id={id} 
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        color: '#1f2937',
        display: 'flex',
        flexDirection: 'column'
      }}
    >

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2563eb', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ color: '#2563eb', margin: 0, fontSize: '24px', textTransform: 'uppercase' }}>Oferta Ubezpieczenia</h1>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>NR: OFF/{quote.id?.substring(0,5).toUpperCase()}/{new Date().getFullYear()}</p>
          <p style={{ margin: 0, fontSize: '10px', opacity: 0.7 }}>Data wydania: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6, margin: '0 0 5px 0' }}>Ubezpieczający:</p>
        <h2 style={{ margin: 0, fontSize: '18px' }}>{quote.firstName} {quote.lastName}</h2>
      </div>

      <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>DANE POJAZDU</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
          <p style={{ margin: 0 }}>Marka i Model: <strong>{quote.brand} {quote.model}</strong></p>
          <p style={{ margin: 0 }}>Rok produkcji: <strong>{quote.carYear}</strong></p>
          <p style={{ margin: 0 }}>Paliwo: <strong>{fuelTypesPL[quote.engineType] || quote.engineType}</strong></p>
          <p style={{ margin: 0 }}>Wiek kierowcy: <strong>{quote.age} lat</strong></p>
        </div>
      </div>

      <div style={{ 
        marginTop: 'auto', 
        marginBottom: '40px', 
        backgroundColor: '#eff6ff', 
        border: '1px solid #bfdbfe', 
        borderRadius: '12px', 
        padding: '30px', 
        textAlign: 'center' 
      }}>
        <h2 style={{ fontSize: '42px', color: '#2563eb', margin: '0 0 10px 0' }}>
          {quote.probablePrice} PLN
        </h2>
        <p style={{ fontSize: '14px', margin: 0, opacity: 0.8, fontWeight: 'bold' }}>
          Sugerowana składka roczna za pakiet:
        </p>
        <p style={{ fontSize: '18px', margin: '5px 0 0 0', color: '#1e40af', textTransform: 'uppercase' }}>
          {selectedVariantsString}
        </p>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', textAlign: 'center', fontSize: '10px', opacity: 0.6 }}>
        <p>Oferta wygenerowana automatycznie przez system Biuro Ubezpieczeń. Przedstawiona kalkulacja nie stanowi oferty handlowej w rozumieniu Art. 66 par. 1 Kodeksu Cywilnego.</p>
      </div>
    </div>
  );
};

export default OfferDocument;