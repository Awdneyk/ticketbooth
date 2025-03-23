'use client';

import React from 'react';
import { useSeatContext } from '../context/SeatContext';

interface TicketCounterProps {
  maxTickets: number;
}

const TicketCounter: React.FC<TicketCounterProps> = ({ maxTickets }) => {
  const { setSelectedTicketCount } = useSeatContext();
  
  // Limit to a reasonable number of tickets (either max available or 10)
  const ticketOptions = Math.min(maxTickets, 10);
  
  const handleSelectTickets = (count: number) => {
    setSelectedTicketCount(count);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">How many tickets?</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: ticketOptions }, (_, i) => i + 1).map((count) => (
            <button
              key={count}
              onClick={() => handleSelectTickets(count)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-4 px-4 rounded border border-blue-200"
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