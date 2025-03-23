'use client';

// Format the date in a consistent way
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
};

// Format currency to display as $XX.XX
export const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

// Calculate service fee (15%)
export const calculateServiceFee = (price: number, quantity: number) => {
  return Math.floor(price * quantity * 0.15);
};

// Calculate total price with service fee
export const calculateTotal = (price: number, quantity: number) => {
  return Math.floor(price * quantity * 1.15);
};