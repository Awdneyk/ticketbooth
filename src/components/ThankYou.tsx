'use client';

import React, { useEffect, useState } from 'react';
import { useSeatContext } from '../context/SeatContext';
import { formatDate, calculateTotal } from '../utils/formatters';

const ThankYou: React.FC = () => {
  const { selectedEvent, selectedSeats, resetSelections, selectedTicketCount } = useSeatContext();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          resetSelections();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetSelections]);
  
  // Automatically redirect after countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      resetSelections();
    }
  }, [countdown, resetSelections]);
  
  // We don't need this fix for the demo as we'll use ticket count for non-seated events
  // and the seats array for seated events in the ThankYou component

  if (!selectedEvent) return null;

  const totalPrice = selectedSeats.length > 0
    ? selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    : calculateTotal(selectedEvent.price.min, selectedTicketCount || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center animate-slide-up">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800">Thank You for Your Purchase!</h2>
          <p className="text-gray-600 mt-2">Your order for {selectedEvent.title} has been confirmed.</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Event:</span>
            <span className="font-medium">{selectedEvent.title}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(selectedEvent.date)} at {selectedEvent.time}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{selectedEvent.venue}, {selectedEvent.location}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tickets:</span>
            <span className="font-medium">{selectedTicketCount}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t mt-2">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          An email with your tickets has been sent to your email address.
        </p>
        
        <button 
          onClick={resetSelections}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          type="button"
        >
          Return to Homepage {countdown > 0 && `(${countdown})`}
        </button>
      </div>
    </div>
  );
};

export default ThankYou;