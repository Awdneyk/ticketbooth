'use client';

import React, { useState, useEffect } from 'react';
import { events, getUniqueLocations, Event } from '../types/events';
import EventCard from '../components/EventCard';
import TicketCounter from '../components/TicketCounter';
import SeatMap from '../components/SeatMap';
import { SeatProvider, useSeatContext } from '../context/SeatContext';

const EventSelection = () => {
  const { 
    selectedEvent, 
    selectedTicketCount, 
    selectionStep,
    resetSelections,
    proceedToCheckout
  } = useSeatContext();
  
  if (!selectedEvent) return null;
  
  const maxTickets = selectedEvent.hasSeating ? 100 : 10; // Just a dummy value for non-seated venues
  
  return (
    <>
      {/* First dropdown: How many tickets? */}
      {selectionStep === 'count' && (
        <TicketCounter maxTickets={maxTickets} />
      )}
      
      {/* Second dropdown: Select seats (only if the venue has seating) */}
      {selectedTicketCount !== null && selectedEvent.hasSeating && (
        <SeatMap />
      )}
      
      {/* For non-seating events, show a simple checkout after selecting count */}
      {selectedTicketCount !== null && !selectedEvent.hasSeating && selectionStep === 'section' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
              <button 
                onClick={resetSelections} 
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                &times;
              </button>
            </div>
            
            <p className="mb-4">You've selected {selectedTicketCount} ticket{selectedTicketCount !== 1 ? 's' : ''}.</p>
            
            <div className="border-t border-b py-4 my-4">
              <div className="flex justify-between mb-2">
                <span>Tickets ({selectedTicketCount} x ${selectedEvent.price.min})</span>
                <span>${selectedEvent.price.min * selectedTicketCount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Service Fee</span>
                <span>${Math.floor(selectedEvent.price.min * selectedTicketCount * 0.15)}</span>
              </div>
              <div className="flex justify-between font-bold mt-4">
                <span>Total</span>
                <span>${Math.floor(selectedEvent.price.min * selectedTicketCount * 1.15)}</span>
              </div>
            </div>
            
            <button 
              onClick={proceedToCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              type="button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Home = () => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
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