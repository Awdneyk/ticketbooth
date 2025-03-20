import React, { useState } from 'react';
import { demoStadium, Section, Seat, SeatStatus } from './types';

const SeatMap = () => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  
  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
  };
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return;
    
    const isSeatSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSeatSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  
  const getSeatStatus = (seat: Seat): SeatStatus => {
    if (selectedSeats.some(s => s.id === seat.id)) {
      return 'selected';
    }
    return seat.status;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Stadium Seat Map</h1>
      
      {!selectedSection ? (
        <VenueOverview 
          venue={demoStadium} 
          onSectionClick={handleSectionClick} 
        />
      ) : (
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => setSelectedSection(null)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-fit"
          >
            ← Back to overview
          </button>
          
          <SectionDetail 
            section={selectedSection} 
            onSeatClick={handleSeatClick}
            getSeatStatus={getSeatStatus}
          />
          
          {selectedSeats.length > 0 && (
            <SeatSelection 
              selectedSeats={selectedSeats} 
              onRemoveSeat={(seat) => handleSeatClick(seat)}
            />
          )}
        </div>
      )}
    </div>
  );
};

const VenueOverview = ({ 
  venue, 
  onSectionClick 
}: { 
  venue: typeof demoStadium, 
  onSectionClick: (section: Section) => void 
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl mb-6">Select a section to view seats</h2>
      
      <div className="w-full max-w-2xl aspect-video bg-gray-200 rounded-lg relative">
        {/* Stadium visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-1/2 border-2 border-gray-400 rounded-lg bg-gray-100 flex">
            {venue.sections.map((section) => (
              <div
                key={section.id}
                className="flex-1 border-r last:border-r-0 border-gray-400 hover:bg-blue-100 cursor-pointer transition-colors flex items-center justify-center"
                onClick={() => onSectionClick(section)}
              >
                <span className="font-medium">{section.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-600">
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
    <div className="bg-white rounded-lg shadow p-6">
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
                      }`}
                      onClick={() => onSeatClick(seat)}
                      disabled={status !== 'available' && status !== 'selected'}
                      title={`Row ${row.name}, Seat ${seat.number} - ${status}`}
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
  onRemoveSeat 
}: { 
  selectedSeats: Seat[],
  onRemoveSeat: (seat: Seat) => void
}) => {
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
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
                    className="text-red-500 hover:text-red-700"
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
          
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default SeatMap;