export const calculatePremium = (data) => {
  let price = 600; 

  switch (data.engineType) {
    case 'electric':
      price += 100;
      break;
    case 'hybrid':
      price += 200;
      break;
    case 'diesel':
      price += 300;
      break;
    case 'petrol':
      price += 0;
      break;
    default:
      break;
  }

  if (data.engineType !== 'electric') {
    const capacity = parseFloat(data.engineCapacity);
    
    if (capacity <= 1.2) {
      price += 100;
    } else if (capacity <= 1.6) {
      price += 300;
    } else if (capacity <= 2.0) {
      price += 600;
    } else if (capacity <= 3.0) {
      price += 1200;
    } else {
      price += 2500;
    }
  }

  const currentYear = new Date().getFullYear();
  const carAge = currentYear - data.carYear;
  
  if (carAge > 20) price += 300;
  else if (carAge > 10) price += 150;

  if (data.driverAge < 24) price *= 1.6;
  else if (data.driverAge < 29) price *= 1.3;

  const discountPercent = Math.min(data.safeDrivingYears * 10, 60);
  price = price * ((100 - discountPercent) / 100);

  if (data.insuranceType === 'ac') price *= 1.5;
  else if (data.insuranceType === 'premium') price *= 2.0;

  return Math.round(price);
};