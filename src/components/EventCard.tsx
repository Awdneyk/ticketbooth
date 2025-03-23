'use client';

import React, { useState } from 'react';
import { Event } from '../types/events';
import { useSeatContext } from '../context/SeatContext';
import { formatDate } from '../utils/formatters';

interface EventCardProps {
  event: Event;
  onClick: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { setSelectedEvent, resetSelections } = useSeatContext();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleClick = () => {
    // Toggle dropdown menu instead of immediately selecting
    setShowDropdown(!showDropdown);
  };
  
  const handleSelectEvent = () => {
    // First reset any existing selections
    resetSelections();
    
    // Set this as the selected event
    setSelectedEvent(event);
    
    // Call the parent's onClick handler
    onClick(event.id);
    
    // Hide dropdown
    setShowDropdown(false);
  };
  
  // Format the date using our formatter
  const formattedDate = formatDate(event.date);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <div 
        className="cursor-pointer"
        onClick={handleClick}
      >
        <div className="h-48 bg-gray-200 relative">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-semibold">
            {event.category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 truncate">{event.title}</h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <span className="text-sm">{formattedDate} • {event.time}</span>
          </div>
          
          <div className="text-sm text-gray-500 mb-3">
            <div>{event.venue}</div>
            <div>{event.location}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-semibold text-gray-900">
              {event.price.min === event.price.max 
                ? `$${event.price.min}` 
                : `$${event.price.min} - $${event.price.max}`}
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              type="button"
            >
              Get Tickets
            </button>
          </div>
        </div>
      </div>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg border-t border-gray-200 z-10 animate-slide-up">
          <div className="p-4">
            <h4 className="font-semibold mb-2">Ticket Options</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={handleSelectEvent}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                >
                  Standard Tickets
                </button>
              </li>
              <li>
                <button 
                  onClick={handleSelectEvent}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                >
                  Premium Tickets
                </button>
              </li>
              <li>
                <button 
                  onClick={handleSelectEvent}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                >
                  VIP Experience
                </button>
              </li>
            </ul>
          </div>
          <div className="border-t px-4 py-2">
            <button
              onClick={() => setShowDropdown(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;