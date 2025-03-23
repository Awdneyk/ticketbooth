'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event } from '../types/events';
import { Section, Seat, SeatStatus } from '../types/stadium';

interface SeatContextProps {
  selectedEvent: Event | null;
  selectedTicketCount: number | null;
  selectedSection: Section | null;
  selectedSeats: Seat[];
  setSelectedEvent: (event: Event | null) => void;
  setSelectedTicketCount: (count: number | null) => void;
  setSelectedSection: (section: Section | null) => void;
  toggleSeatSelection: (seat: Seat) => void;
  resetSelections: () => void;
  isAvailable: (seatId: string) => boolean;
  getSeatStatus: (seat: Seat) => SeatStatus;
  proceedToCheckout: () => void;
  selectionStep: 'count' | 'section' | 'seat' | 'checkout' | 'complete';
}

const SeatContext = createContext<SeatContextProps | undefined>(undefined);

export const SeatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTicketCount, setSelectedTicketCount] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectionStep, setSelectionStep] = useState<'count' | 'section' | 'seat' | 'checkout' | 'complete'>('count');
  
  // Track which seats are unavailable (sold or reserved)
  // In a real app, this would come from your backend
  const [unavailableSeats] = useState<Record<string, boolean>>({
    // Example of some unavailable seats
    'A1-1': true,
    'A1-2': true,
    'B3-10': true,
    'C2-5': true,
    'D1-15': true,
    'E4-7': true,
  });

  const isAvailable = (seatId: string) => {
    return !unavailableSeats[seatId];
  };

  const toggleSeatSelection = (seat: Seat) => {
    if (!isAvailable(seat.id)) return;
    
    const isSeatSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSeatSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Check if we already have selected the max number of tickets
      if (selectedSeats.length >= (selectedTicketCount || 0)) {
        // If so, remove the first seat and add the new one
        const updatedSeats = [...selectedSeats.slice(1), seat];
        setSelectedSeats(updatedSeats);
      } else {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
    
    // If we've selected all seats we need, move to checkout step
    if (selectedSeats.length + 1 >= (selectedTicketCount || 0) && !isSeatSelected) {
      setSelectionStep('checkout');
    }
  };

  const getSeatStatus = (seat: Seat): SeatStatus => {
    if (selectedSeats.some(s => s.id === seat.id)) {
      return 'selected';
    }
    if (!isAvailable(seat.id)) {
      // Use deterministic logic instead of Math.random()
      return seat.id.length % 2 === 0 ? 'sold' : 'reserved';
    }
    return 'available';
  };

  const resetSelections = () => {
    setSelectedTicketCount(null);
    setSelectedSection(null);
    setSelectedSeats([]);
    setSelectionStep('count');
  };

  const proceedToCheckout = () => {
    // In a real app, this would navigate to the checkout page
    alert('Proceeding to checkout! Selected seats: ' + 
      selectedSeats.map(seat => `${seat.row}-${seat.number}`).join(', '));
    setSelectionStep('complete');
  };

  // Update selection step when state changes
  React.useEffect(() => {
    if (selectedTicketCount !== null && selectionStep === 'count') {
      setSelectionStep('section');
    }
  }, [selectedTicketCount, selectionStep]);

  React.useEffect(() => {
    if (selectedSection !== null && selectionStep === 'section') {
      setSelectionStep('seat');
    }
  }, [selectedSection, selectionStep]);

  const value = {
    selectedEvent,
    selectedTicketCount,
    selectedSection,
    selectedSeats,
    setSelectedEvent,
    setSelectedTicketCount,
    setSelectedSection,
    toggleSeatSelection,
    resetSelections,
    isAvailable,
    getSeatStatus,
    proceedToCheckout,
    selectionStep
  };

  return <SeatContext.Provider value={value}>{children}</SeatContext.Provider>;
};

export const useSeatContext = () => {
  const context = useContext(SeatContext);
  if (context === undefined) {
    throw new Error('useSeatContext must be used within a SeatProvider');
  }
  return context;
};