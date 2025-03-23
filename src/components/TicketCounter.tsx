'use client';

import React from 'react';
import { useSeatContext } from '../context/SeatContext';

interface TicketCounterProps {
  maxTickets: number;
}

const TicketCounter: React.FC<TicketCounterProps> = ({ maxTickets }) => {
  const { setSelectedTicketCount, goBack } = useSeatContext();
  
  // Limit to a reasonable number of tickets (either max available or 10)
  const ticketOptions = Math.min(maxTickets, 10);
  
  const handleSelectTickets = (count: number) => {
    setSelectedTicketCount(count);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">How many tickets?</h2>
          <button 
            onClick={goBack}
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: ticketOptions }, (_, i) => i + 1).map((count) => (
            <button
              key={count}
              onClick={() => handleSelectTickets(count)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-4 px-4 rounded border border-blue-200 transition-colors"
              type="button"
            >
              {count}
            </button>
          ))}
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          Select the number of tickets you want to purchase
        </div>
      </div>
    </div>
  );
};

export default TicketCounter;