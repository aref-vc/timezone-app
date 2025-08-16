export interface City {
  id: string;
  name: string;
  country: string;
  timeZone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TimeZoneData {
  city: City;
  currentTime: Date;
  formattedTime: string;
  offset: string;
  isDaytime: boolean;
}

export interface MeetingTime {
  time: string;
  localTime: string;
  participants: {
    cityId: string;
    time: string;
  }[];
  score: number; // 0-100, higher is better
}

export interface AppSettings {
  selectedCities: string[];
  gradientTheme: GradientTheme;
  timeFormat: '12' | '24';
  showSeconds: boolean;
  autoUpdateInterval: number;
}

export interface GradientTheme {
  name: string;
  colors: {
    start: string;
    end: string;
  };
}

export interface TimeZoneState {
  timeZones: TimeZoneData[];
  settings: AppSettings;
  isLoading: boolean;
  lastUpdated: Date;
}