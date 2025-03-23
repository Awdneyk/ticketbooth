'use client';

import { demoStadium, Venue } from './stadium';

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string; // ISO format date string
  time: string;
  location: string;
  venue: string;
  category: EventCategory;
  price: {
    min: number;
    max: number;
  };
  hasSeating: boolean;
  venueMap?: Venue;
}

export type EventCategory = 'concert' | 'sports' | 'theater' | 'comedy' | 'family';

// Dummy events data
export const events: Event[] = [
  {
    id: '1',
    title: 'Taylor Swift: The Eras Tour',
    description: 'Experience the music of Taylor Swift\'s journey through the musical eras of her career so far.',
    imageUrl: '/api/placeholder/400/200?text=Taylor+Swift+Concert',
    date: '2025-04-15',
    time: '19:30',
    location: 'Los Angeles',
    venue: 'Crypto.com Arena',
    category: 'concert',
    price: {
      min: 95,
      max: 450
    },
    hasSeating: true,
    venueMap: demoStadium
  },
  {
    id: '2',
    title: 'Lakers vs. Warriors',
    description: 'Watch the Lakers take on the Warriors in this exciting NBA matchup.',
    imageUrl: '/api/placeholder/400/200?text=Lakers+vs+Warriors',
    date: '2025-04-18',
    time: '20:00',
    location: 'Los Angeles',
    venue: 'Crypto.com Arena',
    category: 'sports',
    price: {
      min: 75,
      max: 350
    },
    hasSeating: true,
    venueMap: demoStadium
  },
  {
    id: '3',
    title: 'Hamilton',
    description: 'The story of America\'s Founding Father Alexander Hamilton, an immigrant from the West Indies who became George Washington\'s right-hand man.',
    imageUrl: '/api/placeholder/400/200?text=Hamilton+Musical',
    date: '2025-04-22',
    time: '19:00',
    location: 'Chicago',
    venue: 'CIBC Theatre',
    category: 'theater',
    price: {
      min: 115,
      max: 550
    },
    hasSeating: false
  },
  {
    id: '4',
    title: 'Dave Chappelle Live',
    description: 'Award-winning comedian Dave Chappelle performs live with his unique perspective on current events.',
    imageUrl: '/api/placeholder/400/200?text=Dave+Chappelle',
    date: '2025-04-10',
    time: '21:00',
    location: 'Las Vegas',
    venue: 'MGM Grand Garden Arena',
    category: 'comedy',
    price: {
      min: 85,
      max: 250
    },
    hasSeating: true,
    venueMap: demoStadium
  },
  {
    id: '5',
    title: 'Disney On Ice',
    description: 'Join Mickey Mouse and your favorite Disney characters as they bring the magic of Disney to life on ice!',
    imageUrl: '/api/placeholder/400/200?text=Disney+On+Ice',
    date: '2025-04-25',
    time: '14:00',
    location: 'Chicago',
    venue: 'United Center',
    category: 'family',
    price: {
      min: 45,
      max: 150
    },
    hasSeating: false
  },
  {
    id: '6',
    title: 'Coldplay: Music of the Spheres Tour',
    description: 'Coldplay brings their spectacular Music of the Spheres World Tour to New York.',
    imageUrl: '/api/placeholder/400/200?text=Coldplay+Concert',
    date: '2025-05-02',
    time: '20:00',
    location: 'New York',
    venue: 'MetLife Stadium',
    category: 'concert',
    price: {
      min: 105,
      max: 500
    },
    hasSeating: true,
    venueMap: demoStadium
  },
  {
    id: '7',
    title: 'UFC 300',
    description: 'Witness the milestone UFC event featuring championship fights and top MMA athletes.',
    imageUrl: '/api/placeholder/400/200?text=UFC+300',
    date: '2025-04-27',
    time: '19:00',
    location: 'Las Vegas',
    venue: 'T-Mobile Arena',
    category: 'sports',
    price: {
      min: 200,
      max: 2500
    },
    hasSeating: false
  },
  {
    id: '8',
    title: 'Wicked',
    description: 'The untold story of the witches of Oz, long before Dorothy dropped in.',
    imageUrl: '/api/placeholder/400/200?text=Wicked+Musical',
    date: '2025-05-10',
    time: '19:30',
    location: 'New York',
    venue: 'Gershwin Theatre',
    category: 'theater',
    price: {
      min: 89,
      max: 350
    },
    hasSeating: false
  }
];

// Helper function to get unique locations from events
export function getUniqueLocations(): string[] {
  const locationsSet = new Set(events.map(event => event.location));
  return Array.from(locationsSet);
}