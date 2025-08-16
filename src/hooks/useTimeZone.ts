import { useState, useEffect, useCallback } from 'react';
import { TimeZoneData, AppSettings, TimeZoneState } from '../types';
import { getTimeZoneData, getCityById } from '../utils';
import { loadSettings, saveSettings, defaultSettings } from '../utils/storage';

export const useTimeZone = () => {
  const [state, setState] = useState<TimeZoneState>({
    timeZones: [],
    settings: defaultSettings,
    isLoading: true,
    lastUpdated: new Date()
  });

  const updateTimeZones = useCallback(() => {
    const { selectedCities, timeFormat, showSeconds } = state.settings;
    const timeZones: TimeZoneData[] = [];

    selectedCities.forEach(cityId => {
      const city = getCityById(cityId);
      if (city) {
        const tzData = getTimeZoneData(city, timeFormat, showSeconds);
        timeZones.push(tzData);
      }
    });

    setState(prev => ({
      ...prev,
      timeZones,
      isLoading: false,
      lastUpdated: new Date()
    }));
  }, [state.settings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setState(prev => {
      const updatedSettings = { ...prev.settings, ...newSettings };
      saveSettings(updatedSettings);
      return {
        ...prev,
        settings: updatedSettings
      };
    });
  }, []);

  const addCity = useCallback((cityId: string) => {
    setState(prev => {
      const newCities = [...prev.settings.selectedCities];
      if (!newCities.includes(cityId) && newCities.length < 6) {
        newCities.push(cityId);
        const updatedSettings = { ...prev.settings, selectedCities: newCities };
        saveSettings(updatedSettings);
        return {
          ...prev,
          settings: updatedSettings
        };
      }
      return prev;
    });
  }, []);

  const removeCity = useCallback((cityId: string) => {
    setState(prev => {
      const newCities = prev.settings.selectedCities.filter(id => id !== cityId);
      if (newCities.length >= 2) { // Minimum 2 cities
        const updatedSettings = { ...prev.settings, selectedCities: newCities };
        saveSettings(updatedSettings);
        return {
          ...prev,
          settings: updatedSettings
        };
      }
      return prev;
    });
  }, []);

  const reorderCities = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newCities = [...prev.settings.selectedCities];
      const [movedCity] = newCities.splice(fromIndex, 1);
      newCities.splice(toIndex, 0, movedCity);
      
      const updatedSettings = { ...prev.settings, selectedCities: newCities };
      saveSettings(updatedSettings);
      return {
        ...prev,
        settings: updatedSettings
      };
    });
  }, []);

  // Initialize settings on mount
  useEffect(() => {
    const loadedSettings = loadSettings();
    setState(prev => ({
      ...prev,
      settings: loadedSettings
    }));
  }, []);

  // Update time zones when settings change
  useEffect(() => {
    updateTimeZones();
  }, [updateTimeZones]);

  // Auto-update timer
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimeZones();
    }, state.settings.autoUpdateInterval);

    return () => clearInterval(interval);
  }, [state.settings.autoUpdateInterval, updateTimeZones]);

  return {
    ...state,
    updateSettings,
    addCity,
    removeCity,
    reorderCities,
    refreshTimeZones: updateTimeZones
  };
};