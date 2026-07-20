function calculateMonthlyPayment(price, months = 60, annualRate = 0.06) {
  const r = annualRate / 12;
  return Math.round((price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

function calculateOrderTotals(subtotal, paymentType) {
  switch (paymentType) {
    case 'full':
      return { totalPrice: subtotal * 0.95, discountAmount: subtotal * 0.05, depositAmount: null, monthlyAmount: null, monthlyDuration: null };
    case 'deposit':
      return { totalPrice: subtotal, discountAmount: null, depositAmount: Math.round(subtotal * 0.25), monthlyAmount: null, monthlyDuration: null };
    case 'monthly': {
      const monthly = calculateMonthlyPayment(subtotal);
      return { totalPrice: monthly * 60, discountAmount: null, depositAmount: null, monthlyAmount: monthly, monthlyDuration: 60 };
    }
    default:
      throw new Error('Type de paiement invalide');
  }
}

function generateOrderNumber() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = Math.random().toString(36).substring(2,8).toUpperCase();
  return `AK${date}${rand}`;
}

module.exports = { calculateMonthlyPayment, calculateOrderTotals, generateOrderNumber };
