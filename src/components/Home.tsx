'use client';

import React, { useState, useEffect } from 'react';
import { events, getUniqueLocations, Event } from '../types/events';
import EventCard from '../components/EventCard';
import TicketCounter from '../components/TicketCounter';
import SeatMap from './SeatMap';
import NonSeatedCheckout from '../components/NonSeatedCheckout';
import ThankYou from '../components/ThankYou';
import { SeatProvider, useSeatContext } from '../context/SeatContext';

// Add animations to global CSS
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}
`;

const EventSelection = () => {
  const { 
    selectedEvent, 
    selectedTicketCount, 
    selectionStep,
    resetSelections
  } = useSeatContext();
  
  if (!selectedEvent) return null;
  
  const maxTickets = selectedEvent.hasSeating ? 100 : 10; // Just a dummy value for non-seated venues
  
  return (
    <>
      {/* Step 1: How many tickets? */}
      {selectionStep === 'count' && (
        <TicketCounter maxTickets={maxTickets} />
      )}
      
      {/* Step 2: Select seats (only if the venue has seating) */}
      {selectedTicketCount !== null && selectedEvent.hasSeating && selectionStep !== 'complete' && (
        <SeatMap />
      )}
      
      {/* For non-seating events, show a simple checkout after selecting count */}
      {selectedTicketCount !== null && !selectedEvent.hasSeating && selectionStep === 'section' && (
        <NonSeatedCheckout />
      )}
      
      {/* Thank you page after checkout */}
      {selectionStep === 'complete' && (
        <ThankYou />
      )}
    </>
  );
};

const Home = () => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Add animation styles to the document once
  useEffect(() => {
    if (!document.getElementById('animation-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'animation-styles';
      styleElement.textContent = animationStyles;
      document.head.appendChild(styleElement);
      
      return () => {
        const element = document.getElementById('animation-styles');
        if (element) {
          element.remove();
        }
      };
    }
  }, []);
  
  const locations = getUniqueLocations();
  
  // Handle filtering
  useEffect(() => {
    let result = [...events];
    
    // Filter by location
    if (locationFilter) {
      result = result.filter(event => event.location === locationFilter);
    }
    
    // Filter by date
    if (dateFilter) {
      result = result.filter(event => event.date >= dateFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(result);
  }, [locationFilter, dateFilter, searchQuery]);
  
  // Navigate to event details page
  const handleEventClick = (eventId: string) => {
    // This is now handled by the SeatContext
    console.log(`Selected event: ${eventId}`);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setLocationFilter('');
    setDateFilter('');
    setSearchQuery('');
  };
  
  return (
    <SeatProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-800">Event Ticketing</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Events</label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by event name, venue..."
                  className="w-full p-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  id="location"
                  className="w-full p-2 border rounded-md"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-48">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  id="date"
                  className="w-full p-2 border rounded-md"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              
              <div className="self-end">
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  type="button"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Events Grid */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredEvents.length === 0 
                ? "No events found" 
                : `${filteredEvents.length} Events Available`}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={handleEventClick}
              />
            ))}
          </div>
          
          {/* Event Selection Modal Dialogs */}
          <EventSelection />
        </main>
        
        <footer className="bg-white border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© {new Date().getUTCFullYear()} Event Ticketing Platform</p>
          </div>
        </footer>
      </div>
    </SeatProvider>
  );
};

export default Home;