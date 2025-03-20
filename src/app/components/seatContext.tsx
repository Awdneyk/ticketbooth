// seatContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Venue, Seat, Section, demoStadium } from './types';

interface SeatContextType {
  venue: Venue;
  selectedSection: Section | null;
  selectedSeats: Seat[];
  setSelectedSection: (section: Section | null) => void;
  toggleSeatSelection: (seat: Seat) => void;
  isSeatSelected: (seatId: string) => boolean;
  clearSelectedSeats: () => void;
  proceedToCheckout: () => void;
}

const SeatContext = createContext<SeatContextType | undefined>(undefined);

export const SeatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venue, setVenue] = useState<Venue>(demoStadium);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Randomly update seat status
      if (Math.random() > 0.7) {
        const updatedVenue = structuredClone(venue);
        const randomSectionIndex = Math.floor(Math.random() * updatedVenue.sections.length);
        const randomSection = updatedVenue.sections[randomSectionIndex];
        const randomRowIndex = Math.floor(Math.random() * randomSection.rows.length);
        const randomRow = randomSection.rows[randomRowIndex];
        const randomSeatIndex = Math.floor(Math.random() * randomRow.seats.length);
        const randomSeat = randomRow.seats[randomSeatIndex];
        
        // Don't affect selected seats
        if (!selectedSeats.some(seat => seat.id === randomSeat.id)) {
          if (randomSeat.status === 'available') {
            randomSeat.status = Math.random() > 0.5 ? 'reserved' : 'sold';
          } else if (randomSeat.status === 'reserved' && Math.random() > 0.7) {
            randomSeat.status = Math.random() > 0.5 ? 'available' : 'sold';
          }
          setVenue(updatedVenue);
        }
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, [venue, selectedSeats]);

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.status !== 'available') return;

    setSelectedSeats(prevSelectedSeats => {
      const isSeatSelected = prevSelectedSeats.some(s => s.id === seat.id);
      
      if (isSeatSelected) {
        return prevSelectedSeats.filter(s => s.id !== seat.id);
      } else {
        return [...prevSelectedSeats, seat];
      }
    });
  };

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.some(seat => seat.id === seatId);
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const proceedToCheckout = () => {
    // This would connect to your payment processing system
    alert(`Processing checkout for ${selectedSeats.length} seats. Total: $${selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}`);
    
    // In a real app, you would make an API call to reserve these seats
    const updatedVenue = structuredClone(venue);
    selectedSeats.forEach(selectedSeat => {
      // Update the seat status in the venue data
      for (const section of updatedVenue.sections) {
        for (const row of section.rows) {
          const seatToUpdate = row.seats.find(seat => seat.id === selectedSeat.id);
          if (seatToUpdate) {
            seatToUpdate.status = 'reserved';
          }
        }
      }
    });
    
    setVenue(updatedVenue);
    clearSelectedSeats();
  };

  return (
    <SeatContext.Provider value={{
      venue,
      selectedSection,
      selectedSeats,
      setSelectedSection,
      toggleSeatSelection,
      isSeatSelected,
      clearSelectedSeats,
      proceedToCheckout
    }}>
      {children}
    </SeatContext.Provider>
  );
};

export const useSeatContext = () => {
  const context = useContext(SeatContext);
  if (context === undefined) {
    throw new Error('useSeatContext must be used within a SeatProvider');
  }
  return context;
};