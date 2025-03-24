'use client';

import React from 'react';
import { useSeatContext } from '../context/SeatContext';
import { Section, Seat, SeatStatus, demoStadium } from '../types/stadium';

const SeatMap: React.FC = () => {
  const { 
    selectedEvent, 
    selectedSection, 
    selectedSeats, 
    setSelectedSection, 
    toggleSeatSelection, 
    getSeatStatus,
    proceedToCheckout,
    goBack,
    selectionStep
  } = useSeatContext();

  if (!selectedEvent || selectionStep === 'count') {
    return null;
  }

  // Use the venue from the selected event, or fall back to the demo stadium
  // This ensures we always have a valid venue object
  const venue = selectedEvent.venueMap || demoStadium;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
            <button 
              onClick={goBack} 
              className="text-gray-500 hover:text-gray-700"
              type="button"
              aria-label="Go back"
            >
              &times;
            </button>
          </div>
          
          {selectionStep === 'section' && (
            <VenueOverview 
              venue={venue} 
              onSectionClick={setSelectedSection} 
            />
          )}
          
          {selectionStep === 'seat' && selectedSection && (
            <SectionDetail 
              section={selectedSection} 
              onSeatClick={toggleSeatSelection}
              getSeatStatus={getSeatStatus}
            />
          )}
          
          {(selectionStep === 'checkout' || selectionStep === 'seat' && selectedSeats.length > 0) && (
            <SeatSelection 
              selectedSeats={selectedSeats} 
              onRemoveSeat={toggleSeatSelection}
              onCheckout={proceedToCheckout}
              onGoBack={goBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const VenueOverview = ({ 
  venue, 
  onSectionClick 
}: { 
  venue: {
    id: string;
    name: string;
    sections: Section[];
    mapImageUrl?: string;
  }, 
  onSectionClick: (section: Section) => void 
}) => {
  // Safely check that venue and sections exist
  if (!venue || !venue.sections || !Array.isArray(venue.sections)) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl mb-6">No sections available</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl mb-6">Select a section</h2>
      
      <div className="w-full max-w-2xl aspect-video bg-gray-200 rounded-lg relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-1/2 border-2 border-gray-400 rounded-lg bg-gray-100 flex">
            {venue.sections.map((section: Section) => (
              <div
                key={section.id}
                className="flex-1 border-r last:border-r-0 border-gray-400 hover:bg-blue-100 cursor-pointer transition-colors flex flex-col items-center justify-center p-2"
                onClick={() => onSectionClick(section)}
              >
                <span className="font-medium">{section.name}</span>
                <span className="text-sm text-gray-600">${section.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-600">
        Click on a section to view and select seats
      </div>
    </div>
  );
};

const SectionDetail = ({ 
  section, 
  onSeatClick,
  getSeatStatus
}: { 
  section: Section, 
  onSeatClick: (seat: Seat) => void,
  getSeatStatus: (seat: Seat) => SeatStatus
}) => {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{section.name} - Select Your Seats</h2>
      
      {section.viewImageUrl && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">View from this section:</h3>
          <img 
            src={section.viewImageUrl} 
            alt={`View from ${section.name}`} 
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
        </div>
      )}
      
      <div className="mb-6">
        <div className="w-full bg-gray-200 p-2 text-center mb-6 rounded">
          STAGE / FIELD
        </div>
        
        <div className="flex flex-col space-y-4">
          {section.rows.map((row) => (
            <div key={row.id} className="flex items-center">
              <div className="w-8 font-medium text-gray-600">{row.name}</div>
              <div className="flex space-x-2">
                {row.seats.map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat.id}
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        status === 'available' ? 'bg-green-500 hover:bg-green-600 cursor-pointer' :
                        status === 'selected' ? 'bg-blue-600 text-white' :
                        status === 'reserved' ? 'bg-yellow-500 cursor-not-allowed' :
                        'bg-gray-400 cursor-not-allowed'
                      } transition-colors`}
                      onClick={() => onSeatClick(seat)}
                      disabled={status !== 'available' && status !== 'selected'}
                      title={`Row ${row.name}, Seat ${seat.number} - ${status}`}
                      type="button"
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-6 justify-center mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
          <span>Sold</span>
        </div>
      </div>
    </div>
  );
};

const SeatSelection = ({ 
  selectedSeats,
  onRemoveSeat,
  onCheckout,
  onGoBack
}: { 
  selectedSeats: Seat[],
  onRemoveSeat: (seat: Seat) => void,
  onCheckout: () => void,
  onGoBack: () => void
}) => {
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  
  return (
    <div className="bg-white rounded-lg mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Selected Seats</h2>
      
      {selectedSeats.length === 0 ? (
        <p className="text-gray-500">No seats selected</p>
      ) : (
        <>
          <ul className="mb-4 divide-y">
            {selectedSeats.map(seat => (
              <li key={seat.id} className="py-2 flex justify-between items-center">
                <span>Row {seat.row}, Seat {seat.number}</span>
                <div className="flex items-center">
                  <span className="mr-4">${seat.price}</span>
                  <button 
                    onClick={() => onRemoveSeat(seat)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="border-t pt-4 flex justify-between font-medium">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              onClick={onGoBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
              type="button"
            >
              Back
            </button>
            
            <button 
              onClick={onCheckout}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              type="button"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SeatMap;