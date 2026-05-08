import React from 'react';

const OfferDocument = ({ quote, id }) => {
  // Ten "bezpiecznik" usuwa błąd TypeError w konsoli
  if (!quote) return null;

  const fuelLabels = {
    'PETROL': 'Benzyna',
    'DIESEL': 'Diesel',
    'LPG': 'Benzyna+LPG',
    'HYBRID': 'Hybryda',
    'ELECTRIC': 'Elektryczny'
  };

  return (
    <div id={id} style={{ width: '210mm', padding: '20mm', backgroundColor: '#fff', color: '#1a202c', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2563eb', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', margin: 0 }}>OFERTA UBEZPIECZENIA</h1>
        <p style={{ fontWeight: 'bold' }}>OFF/{quote.id?.substring(0, 5).toUpperCase()}/2026</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Ubezpieczający:</p>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{quote.firstName} {quote.lastName}</p>
      </div>

      <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', textTransform: 'uppercase' }}>Dane Pojazdu</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
        <p>Marka i Model: <strong>{quote.brand} {quote.model}</strong></p>
        <p>Rok: <strong>{quote.carYear}</strong></p>
        <p>Paliwo: <strong>{fuelLabels[quote.engineType] || quote.engineType}</strong></p>
        <p>Wiek kierowcy: <strong>{quote.age} lat</strong></p>
      </div>

      <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f1f5f9', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', color: '#2563eb', margin: 0 }}>{quote.probablePrice} PLN</h2>
        <p>Sugerowana składka roczna OC+AC</p>
      </div>
    </div>
  );
};

export default OfferDocument;