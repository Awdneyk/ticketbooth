'use client';

export type SeatStatus = 'available' | 'selected' | 'reserved' | 'sold';

export interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
  status: SeatStatus;
}

export interface Row {
  id: string;
  name: string;
  seats: Seat[];
}

export interface Section {
  id: string;
  name: string;
  price: number;
  rows: Row[];
  viewImageUrl?: string;
}

export interface Venue {
  id: string;
  name: string;
  sections: Section[];
}

// Create demo stadium with 5 sections, each with 4 rows of 5 seats (100 total)
export const demoStadium: Venue = {
  id: 'demo-stadium',
  name: 'Demo Stadium',
  sections: [
    {
      id: 'A',
      name: 'Section A',
      price: 120,
      viewImageUrl: '/api/placeholder/600/400?text=View+from+Section+A',
      rows: createRows('A', 4, 5, 120),
    },
    {
      id: 'B',
      name: 'Section B',
      price: 30,
      viewImageUrl: '/api/placeholder/600/400?text=View+from+Section+B',
      rows: createRows('B', 4, 5, 30),
    },
    {
      id: 'C',
      name: 'Section C',
      price: 30,
      viewImageUrl: '/api/placeholder/600/400?text=View+from+Section+C',
      rows: createRows('C', 4, 5, 30),
    },
    {
      id: 'D',
      name: 'Section D',
      price: 30,
      viewImageUrl: '/api/placeholder/600/400?text=View+from+Section+D',
      rows: createRows('D', 4, 5, 30),
    },
    {
      id: 'E',
      name: 'Section E',
      price: 30,
      viewImageUrl: '/api/placeholder/600/400?text=View+from+Section+E',
      rows: createRows('E', 4, 5, 30),
    },
  ],
};

// Helper function to create rows and seats
function createRows(sectionId: string, numRows: number, seatsPerRow: number, price: number): Row[] {
  const rows: Row[] = [];
  
  for (let i = 1; i <= numRows; i++) {
    const seats: Seat[] = [];
    
    for (let j = 1; j <= seatsPerRow; j++) {
      seats.push({
        id: `${sectionId}${i}-${j}`,
        row: i.toString(),
        number: j,
        price,
        status: 'available',
      });
    }
    
    rows.push({
      id: `${sectionId}${i}`,
      name: i.toString(),
      seats,
    });
  }
  
  return rows;
}

// Function to get available seat count
export function getAvailableSeatCount(venue: Venue): number {
  let count = 0;
  venue.sections.forEach(section => {
    section.rows.forEach(row => {
      row.seats.forEach(seat => {
        if (seat.status === 'available') {
          count++;
        }
      });
    });
  });
  return count;
}