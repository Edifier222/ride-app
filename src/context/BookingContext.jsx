import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    vehicle: null,
    location: '',
    startDate: '',
    endDate: '',
    protectionPlan: null,
    extras: {
      youngDriver: false,
      additionalDriver: false,
      delivery: false,
    },
    payment: {
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: '',
    },
    verification: {
      licenseUploaded: false,
      selfieUploaded: false,
      verified: false,
    },
    confirmed: false,
    bookingId: null,
  });

  const updateBooking = (updates) => {
    setBooking(prev => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setBooking({
      vehicle: null,
      location: '',
      startDate: '',
      endDate: '',
      protectionPlan: null,
      extras: { youngDriver: false, additionalDriver: false, delivery: false },
      payment: { cardNumber: '', expiry: '', cvc: '', name: '' },
      verification: { licenseUploaded: false, selfieUploaded: false, verified: false },
      confirmed: false,
      bookingId: null,
    });
  };

  const getTripDays = () => {
    if (!booking.startDate || !booking.endDate) return 1;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const getTripTotal = () => {
    if (!booking.vehicle) return 0;
    const days = getTripDays();
    const vehicleCost = booking.vehicle.pricePerDay * days;
    const protectionCost = (booking.protectionPlan?.pricePerDay || 0) * days;
    const deliveryFee = booking.extras.delivery && booking.vehicle.delivery ? booking.vehicle.deliveryFee : 0;
    const youngDriverFee = booking.extras.youngDriver ? 15 * days : 0;
    const additionalDriverFee = booking.extras.additionalDriver ? 10 * days : 0;
    const serviceFee = Math.round(vehicleCost * 0.10);
    return {
      vehicleCost,
      protectionCost,
      deliveryFee,
      youngDriverFee,
      additionalDriverFee,
      serviceFee,
      total: vehicleCost + protectionCost + deliveryFee + youngDriverFee + additionalDriverFee + serviceFee,
      days,
    };
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking, getTripDays, getTripTotal }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
