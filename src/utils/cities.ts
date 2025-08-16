import { City, GradientTheme } from '../types';

export const CITIES: City[] = [
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    timeZone: 'Europe/London',
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    timeZone: 'Asia/Tokyo',
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    timeZone: 'America/New_York',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'United States',
    timeZone: 'America/Los_Angeles',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    timeZone: 'Australia/Sydney',
    coordinates: { lat: -33.8688, lng: 151.2093 }
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    timeZone: 'Asia/Dubai',
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    timeZone: 'Europe/Paris',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    timeZone: 'Europe/Berlin',
    coordinates: { lat: 52.5200, lng: 13.4050 }
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    timeZone: 'Asia/Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 }
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    country: 'Hong Kong',
    timeZone: 'Asia/Hong_Kong',
    coordinates: { lat: 22.3193, lng: 114.1694 }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    timeZone: 'Asia/Kolkata',
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    country: 'Brazil',
    timeZone: 'America/Sao_Paulo',
    coordinates: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: 'moscow',
    name: 'Moscow',
    country: 'Russia',
    timeZone: 'Europe/Moscow',
    coordinates: { lat: 55.7558, lng: 37.6176 }
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    timeZone: 'Africa/Cairo',
    coordinates: { lat: 30.0444, lng: 31.2357 }
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    country: 'Canada',
    timeZone: 'America/Vancouver',
    coordinates: { lat: 49.2827, lng: -123.1207 }
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    timeZone: 'America/Toronto',
    coordinates: { lat: 43.6532, lng: -79.3832 }
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    timeZone: 'Europe/Istanbul',
    coordinates: { lat: 41.0082, lng: 28.9784 }
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    timeZone: 'Australia/Melbourne',
    coordinates: { lat: -37.8136, lng: 144.9631 }
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    timeZone: 'Africa/Johannesburg',
    coordinates: { lat: -33.9249, lng: 18.4241 }
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    timeZone: 'Asia/Seoul',
    coordinates: { lat: 37.5665, lng: 126.9780 }
  }
];

export const GRADIENT_THEMES: GradientTheme[] = [
  {
    name: 'Sunset',
    colors: {
      start: '#ff6b6b',
      end: '#4ecdc4'
    }
  },
  {
    name: 'Ocean',
    colors: {
      start: '#667eea',
      end: '#764ba2'
    }
  },
  {
    name: 'Forest',
    colors: {
      start: '#134e5e',
      end: '#71b280'
    }
  },
  {
    name: 'Aurora',
    colors: {
      start: '#a8edea',
      end: '#fed6e3'
    }
  },
  {
    name: 'Cosmic',
    colors: {
      start: '#2C5364',
      end: '#203A43'
    }
  },
  {
    name: 'Warm',
    colors: {
      start: '#ffecd2',
      end: '#fcb69f'
    }
  }
];

export const getCityById = (id: string): City | undefined => {
  return CITIES.find(city => city.id === id);
};

export const searchCities = (query: string): City[] => {
  const lowercaseQuery = query.toLowerCase();
  return CITIES.filter(city => 
    city.name.toLowerCase().includes(lowercaseQuery) ||
    city.country.toLowerCase().includes(lowercaseQuery)
  );
};