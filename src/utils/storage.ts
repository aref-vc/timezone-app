import { AppSettings } from '../types';

const STORAGE_KEY = 'timezone-app-settings';

export const defaultSettings: AppSettings = {
  selectedCities: ['london', 'tokyo', 'new-york'],
  gradientTheme: {
    name: 'Sunset',
    colors: {
      start: '#ff6b6b',
      end: '#4ecdc4'
    }
  },
  timeFormat: '24',
  showSeconds: false,
  autoUpdateInterval: 1000
};

export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};

export const clearSettings = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear settings from localStorage:', error);
  }
};

export const updateSettings = (updates: Partial<AppSettings>): AppSettings => {
  const currentSettings = loadSettings();
  const newSettings = { ...currentSettings, ...updates };
  saveSettings(newSettings);
  return newSettings;
};