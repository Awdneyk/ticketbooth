// types.ts

export type SeatStatus = 'available' | 'selected' | 'reserved' | 'sold';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

export interface Row {
  id: string;
  name: string;
  seats: Seat[];
}

export interface Section {
  id: string;
  name: string;
  rows: Row[];
  viewImageUrl?: string; // URL to an image showing view from this section
}

export interface Venue {
  id: string;
  name: string;
  sections: Section[];
}

// Demo data
export const demoStadium: Venue = {
  id: 'demo-stadium',
  name: 'Demo Stadium',
  sections: Array(5).fill(null).map((_, sectionIndex) => {
    const sectionId = `section-${sectionIndex + 1}`;
    return {
      id: sectionId,
      name: `Section ${sectionIndex + 1}`,
      viewImageUrl: `/api/placeholder/800/400?text=View from Section ${sectionIndex + 1}`,
      rows: Array(4).fill(null).map((_, rowIndex) => {
        const rowId = `${sectionId}-row-${rowIndex + 1}`;
        const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, D
        
        return {
          id: rowId,
          name: rowName,
          seats: Array(5).fill(null).map((_, seatIndex) => {
            const seatNumber = seatIndex + 1;
            return {
              id: `${rowId}-seat-${seatNumber}`,
              row: rowName,
              number: seatNumber,
              status: Math.random() > 0.3 ? 'available' : 
                     Math.random() > 0.5 ? 'reserved' : 'sold',
              price: 50 // All seats same price for demo
            };
          })
        };
      })
    };
  })
};