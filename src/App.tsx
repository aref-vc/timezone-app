import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { TimeZoneData, AppSettings, City } from './types';
import { TimelineBar } from './components/timeline';
import { TimeZoneSection, BottomBar } from './components/layout';
import { CitySelector } from './components';
import { getCityById, getTimeZoneData } from './utils';
import { DEFAULT_SETTINGS, APP_CONFIG, STORAGE_KEYS } from './constants';

// Storage utilities
const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
};

function App() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [timeZones, setTimeZones] = useState<TimeZoneData[]>([]);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [, setShowSettings] = useState(false);
  const [virtualHour, setVirtualHour] = useState<number | undefined>(undefined);

  const updateTimeZones = useCallback(() => {
    const newTimeZones = settings.selectedCities
      .map(cityId => getCityById(cityId))
      .filter((city): city is City => !!city)
      .map(city => getTimeZoneData(city, settings.timeFormat, settings.showSeconds));
    
    setTimeZones(newTimeZones);
  }, [settings]);

  const addCity = useCallback((cityId: string) => {
    if (!settings.selectedCities.includes(cityId) && settings.selectedCities.length < APP_CONFIG.MAX_CITIES) {
      const newSettings = { ...settings, selectedCities: [...settings.selectedCities, cityId] };
      setSettings(newSettings);
      saveSettings(newSettings);
    }
  }, [settings]);

  const handleTimeChange = useCallback((hour: number) => {
    setVirtualHour(hour);
  }, []);

  // Get current hour for timeline
  const currentHour = virtualHour !== undefined ? virtualHour : new Date().getHours();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCitySelector(false);
        setShowSettings(false);
        setVirtualHour(undefined);
      } else if (e.key === 'r' || e.key === 'R') {
        setVirtualHour(undefined);
      } else if (e.key === 'ArrowLeft') {
        setVirtualHour(prev => Math.max(0, (prev ?? new Date().getHours()) - 1));
      } else if (e.key === 'ArrowRight') {
        setVirtualHour(prev => Math.min(23, (prev ?? new Date().getHours()) + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, []);

  useEffect(() => {
    updateTimeZones();
    const interval = setInterval(updateTimeZones, settings.autoUpdateInterval);
    return () => clearInterval(interval);
  }, [updateTimeZones, settings.autoUpdateInterval]);

  return (
    <>
      {/* Main content */}
      <div 
        className="min-h-screen relative overflow-hidden flex"
        style={{
          position: 'relative'
        }}
      >
        {/* Time zone sections */}
        {timeZones.map((timeZone, index) => (
          <TimeZoneSection
            key={timeZone.city.id}
            timeZone={timeZone}
            index={index}
            total={timeZones.length}
            virtualHour={virtualHour}
          />
        ))}
      </div>
      
      {/* Blur layer for text contrast */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%),
          linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)
        `,
        backdropFilter: 'blur(25px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(25px) saturate(1.2)',
        zIndex: 5000,
        pointerEvents: 'none'
      }} />

      {/* Top timeline bar */}
      <TimelineBar
        currentHour={currentHour}
        onTimeChange={handleTimeChange}
      />

      {/* Bottom bar */}
      <BottomBar
        onAddCity={() => setShowCitySelector(true)}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* City selector modal */}
      <AnimatePresence>
        {showCitySelector && (
          <CitySelector
            selectedCities={settings.selectedCities}
            onAddCity={addCity}
            onClose={() => setShowCitySelector(false)}
            maxCities={APP_CONFIG.MAX_CITIES}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;