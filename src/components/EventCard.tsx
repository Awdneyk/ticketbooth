'use client';

import React from 'react';
import { Event } from '../types/events';
import { useSeatContext } from '../context/SeatContext';

interface EventCardProps {
  event: Event;
  onClick: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { setSelectedEvent, resetSelections } = useSeatContext();
  
  const handleClick = () => {
    // First reset any existing selections
    resetSelections();
    
    // Set this as the selected event
    setSelectedEvent(event);
    
    // Call the parent's onClick handler
    onClick(event.id);
  };
  
  // Format the date in a consistent way that works on both server and client
  // Avoid using toLocaleDateString which can cause hydration errors
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getUTCDay()];
    const monthName = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };
  
  const formattedDate = formatDate(event.date);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            type="button"
          >
            Get Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;