import type { AppSettings } from '../types';

export const APP_CONFIG = {
  MAX_CITIES: 6,
  MIN_CITIES: 2,
  DEFAULT_UPDATE_INTERVAL: 1000,
  DEFAULT_PORT: 3005,
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  selectedCities: ['london', 'tokyo'],
  timeFormat: '24' as const,
  showSeconds: false,
  autoUpdateInterval: APP_CONFIG.DEFAULT_UPDATE_INTERVAL,
};

export const STORAGE_KEYS = {
  SETTINGS: 'timezone-app-settings',
} as const;

export const ANIMATION_CONFIG = {
  TIMELINE_DOTS: {
    ACTIVE_SCALE: 1.8,
    PASSED_SCALE: 1.3,
    HOVER_SCALE: 1.5,
    NORMAL_SCALE: 1,
  },
  TRANSITIONS: {
    SPRING: { type: "spring", stiffness: 400, damping: 35 },
    LAYOUT: { type: "spring", stiffness: 300, damping: 30 },
  },
} as const;

export const TIME_OF_DAY_HOURS = {
  MORNING_START: 5,
  MORNING_END: 10,
  DAY_START: 10,
  DAY_END: 17,
  EVENING_START: 17,
  EVENING_END: 22,
  DAYTIME_START: 6,
  DAYTIME_END: 18,
} as const;