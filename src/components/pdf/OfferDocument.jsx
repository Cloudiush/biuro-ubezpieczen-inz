import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: 40,
    fontSize: 12,
    color: '#333'
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #0066cc',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    color: '#0a2558',
    fontWeight: 'bold'
  },
  companyInfo: {
    fontSize: 10,
    textAlign: 'right',
    color: '#666'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  label: {
    color: '#666',
    fontSize: 10,
    marginBottom: 4
  },
  value: {
    fontSize: 14,
    marginBottom: 10
  },
  priceBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f0f7ff',
    borderRadius: 5,
    border: '1px solid #cce5ff',
    alignItems: 'center'
  },
  price: {
    fontSize: 30,
    color: '#0066cc',
    fontWeight: 'bold',
    marginTop: 10
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    color: '#999',
    borderTop: '1px solid #eee',
    paddingTop: 10
  }
});

const OfferDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.header}>
        <Text style={styles.title}>OFERTA UBEZPIECZENIA</Text>
        <View style={styles.companyInfo}>
          <Text>Biuro Ubezpieczeń Inż.</Text>
          <Text>ul. Studencka 12/3</Text>
          <Text>00-001 Warszawa</Text>
          <Text>NIP: 123-456-78-90</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Klient:</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Data sporządzenia:</Text>
          <Text style={styles.value}>
            {data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('pl-PL') : 'Dzisiaj'}
          </Text>
        </View>
      </View>

      <View style={{ borderBottom: '1px solid #eee', marginVertical: 20 }} />

      <Text style={{ fontSize: 16, marginBottom: 15, color: '#0a2558' }}>Szczegóły Pojazdu</Text>
      
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Rok produkcji:</Text>
          <Text style={styles.value}>{data.carYear}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Rodzaj paliwa:</Text>
          <Text style={styles.value}>
            {data.engineType === 'petrol' ? 'Benzyna' : 
             data.engineType === 'diesel' ? 'Diesel' : 
             data.engineType === 'hybrid' ? 'Hybryda' : 
             data.engineType === 'electric' ? 'Elektryczny' : data.engineType}
          </Text>
        </View>
      </View>

      <View style={styles.priceBox}>
        <Text>CAŁKOWITA SKŁADKA ROCZNA</Text>
        <Text style={styles.price}>{data.price} PLN</Text>
        <Text style={{ fontSize: 10, marginTop: 5, color: '#666' }}>Pakiet: OC + AC (Standard)</Text>
      </View>

      <Text style={{ marginTop: 20, fontSize: 10, color: '#666' }}>
        * Niniejszy dokument jest ofertą handlową ważną przez 14 dni od daty wystawienia.
        W celu zawarcia polisy prosimy o kontakt z biurem lub opłacenie składki online.
      </Text>

      <View style={styles.footer}>
        <Text>Wygenerowano automatycznie w systemie Biuro Ubezpieczeń - Projekt Inżynierski 2026</Text>
      </View>

    </Page>
  </Document>
);

export default OfferDocument;