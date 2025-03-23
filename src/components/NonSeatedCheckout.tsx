'use client';

import React from 'react';
import { useSeatContext } from '../context/SeatContext';
import { calculateServiceFee, calculateTotal } from '../utils/formatters';

const NonSeatedCheckout: React.FC = () => {
  const { 
    selectedEvent, 
    selectedTicketCount, 
    resetSelections, 
    proceedToCheckout,
    goBack
  } = useSeatContext();
  
  if (!selectedEvent || !selectedTicketCount) return null;
  
  const ticketPrice = selectedEvent.price.min;
  const ticketSubtotal = ticketPrice * selectedTicketCount;
  const serviceFee = calculateServiceFee(ticketPrice, selectedTicketCount);
  const totalAmount = calculateTotal(ticketPrice, selectedTicketCount);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
          <button 
            onClick={goBack} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Go back"
          >
            &times;
          </button>
        </div>
        
        <p className="mb-4">You've selected {selectedTicketCount} ticket{selectedTicketCount !== 1 ? 's' : ''}.</p>
        
        <div className="border-t border-b py-4 my-4">
          <div className="flex justify-between mb-2">
            <span>Tickets ({selectedTicketCount} x ${ticketPrice})</span>
            <span>${ticketSubtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Service Fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between font-bold mt-4">
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={goBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
            type="button"
          >
            Back
          </button>
          
          <button 
            onClick={proceedToCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            type="button"
          >
            Complete Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default NonSeatedCheckout;