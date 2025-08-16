import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Menu } from 'lucide-react';
import sunIcon from './assets/sun-fill.svg';
import moonIcon from './assets/moon-stars-fill.svg';

// Types
interface City {
  id: string;
  name: string;
  country: string;
  timeZone: string;
  coordinates: { lat: number; lng: number; };
}

interface TimeZoneData {
  city: City;
  currentTime: Date;
  formattedTime: string;
  offset: string;
  isDaytime: boolean;
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
}

interface AppSettings {
  selectedCities: string[];
  timeFormat: '12' | '24';
  showSeconds: boolean;
  autoUpdateInterval: number;
}

// Cities data
const CITIES: City[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', timeZone: 'Europe/London', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: 'new-york', name: 'New York', country: 'United States', timeZone: 'America/New_York', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney', coordinates: { lat: -33.8688, lng: 151.2093 } },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai', coordinates: { lat: 25.2048, lng: 55.2708 } },
  { id: 'paris', name: 'Paris', country: 'France', timeZone: 'Europe/Paris', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore', coordinates: { lat: 1.3521, lng: 103.8198 } },
];

// Utility functions
const getCurrentTimeInTimeZone = (timeZone: string): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone }));
};

const formatTime = (date: Date, format: '12' | '24' = '24', showSeconds: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12'
  };
  if (showSeconds) options.second = '2-digit';
  return date.toLocaleTimeString('en-US', options);
};

const getTimeZoneOffset = (timeZone: string): string => {
  const now = new Date();
  const target = new Date(now.toLocaleString('en-US', { timeZone }));
  const local = new Date(now.toLocaleString('en-US'));
  const offsetMs = target.getTime() - local.getTime();
  const offsetHours = offsetMs / (1000 * 60 * 60);
  const sign = offsetHours >= 0 ? '+' : '-';
  const hours = Math.abs(Math.floor(offsetHours));
  const minutes = Math.abs((offsetHours % 1) * 60);
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const getTimeOfDay = (date: Date): 'morning' | 'day' | 'evening' | 'night' => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

const isDaytime = (date: Date): boolean => {
  const hour = date.getHours();
  return hour >= 6 && hour < 18;
};

const getCityById = (id: string): City | undefined => CITIES.find(city => city.id === id);

const getTimeZoneData = (city: City, timeFormat: '12' | '24', showSeconds: boolean): TimeZoneData => {
  const currentTime = getCurrentTimeInTimeZone(city.timeZone);
  return {
    city,
    currentTime,
    formattedTime: formatTime(currentTime, timeFormat, showSeconds),
    offset: getTimeZoneOffset(city.timeZone),
    isDaytime: isDaytime(currentTime),
    timeOfDay: getTimeOfDay(currentTime)
  };
};

const getGradientClass = (cityId: string, timeOfDay: 'morning' | 'day' | 'evening' | 'night'): string => {
  const normalizedCityId = cityId.replace('-', '').toLowerCase();
  
  // Map city IDs to gradient class names
  const cityGradientMap: { [key: string]: string } = {
    'london': 'london',
    'tokyo': 'tokyo', 
    'newyork': 'newyork',
    'losangeles': 'losangeles',
    'sydney': 'sydney',
    'dubai': 'dubai',
    'paris': 'paris',
    'singapore': 'singapore'
  };
  
  const gradientCity = cityGradientMap[normalizedCityId] || 'default';
  return `gradient-${gradientCity}-${timeOfDay}`;
};

const isLightBackground = (cityId: string, timeOfDay: 'morning' | 'day' | 'evening' | 'night'): boolean => {
  return (timeOfDay === 'morning' || timeOfDay === 'day') && 
         ['london', 'tokyo', 'new-york', 'newyork'].includes(cityId.replace('-', ''));
};

// Storage utilities
const defaultSettings: AppSettings = {
  selectedCities: ['london', 'tokyo'],
  timeFormat: '24',
  showSeconds: false,
  autoUpdateInterval: 1000
};

const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem('timezone-app-settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem('timezone-app-settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
};

// Components
const TimelineScrollbar: React.FC<{
  currentHour: number;
  onTimeChange: (hour: number) => void;
}> = ({ currentHour, onTimeChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateTimeFromPosition(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateTimeFromPosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateTimeFromPosition = (clientX: number) => {
    if (!scrollbarRef.current) return;
    
    const rect = scrollbarRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newHour = Math.round(percentage * 23);
    
    if (newHour !== currentHour) {
      onTimeChange(newHour);
    }
  };

  const handleDotClick = (hour: number) => {
    onTimeChange(hour);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const thumbPosition = (currentHour / 23) * 100;

  return (
    <div className="w-full flex flex-col items-center">
      {/* DEBUG: Visible test element */}
      <div style={{
        width: '100%',
        height: '20px',
        backgroundColor: 'lime',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        DEBUG: SCROLLBAR AREA
      </div>
      
      <div
        ref={scrollbarRef}
        className="relative w-full flex items-center"
        style={{ 
          height: '50px', 
          minHeight: '50px',
          backgroundColor: 'rgba(255, 255, 0, 0.5)',
          border: '2px solid red'
        }}
        onClick={(e) => updateTimeFromPosition(e.clientX)}
      >
        {/* DEBUG: Simple test dots */}
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i / 23) * 100}%`,
              top: '50%',
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              border: '2px solid white',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 99999,
              fontSize: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDotClick(i);
            }}
          >
            {i}
          </div>
        ))}
        
        {/* Draggable thumb */}
        <motion.div
          className="timeline-thumb"
          style={{ left: `calc(${thumbPosition}% - 6px)` }}
          onMouseDown={handleMouseDown}
          animate={{ 
            left: `calc(${thumbPosition}% - 6px)`,
            scale: isDragging ? 1.05 : 1 
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      </div>
      
      {/* Hour labels */}
      <div className="flex justify-between mt-6 w-full">
        {Array.from({ length: 25 }, (_, i) => i).filter(i => i % 6 === 0).map(hour => (
          <button
            key={hour}
            onClick={() => onTimeChange(hour)}
            className="instrument-serif text-xs font-light opacity-60 hover:opacity-90 transition-all duration-300"
            style={{ 
              color: '#FFFFFF',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
          >
            {hour.toString().padStart(2, '0')}:00
          </button>
        ))}
      </div>
    </div>
  );
};

const TimeZoneSection: React.FC<{
  timeZone: TimeZoneData;
  index: number;
  total: number;
  virtualHour?: number;
}> = ({ timeZone, index, total, virtualHour }) => {
  const { city, formattedTime, timeOfDay } = timeZone;
  
  // Calculate time for virtual hour considering timezone offset
  const displayTime = (() => {
    if (virtualHour !== undefined) {
      const baseDate = new Date();
      const localHour = virtualHour;
      
      // Get the timezone offset difference
      const localTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), localHour, 0, 0);
      const utcTime = new Date(localTime.getTime() - (localTime.getTimezoneOffset() * 60000));
      const cityTime = new Date(utcTime.toLocaleString('en-US', { timeZone: city.timeZone }));
      
      return formatTime(cityTime, '24', false);
    }
    return formattedTime;
  })();
  
  const virtualTimeOfDay = (() => {
    if (virtualHour !== undefined) {
      const baseDate = new Date();
      const localTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), virtualHour, 0, 0);
      const utcTime = new Date(localTime.getTime() - (localTime.getTimezoneOffset() * 60000));
      const cityTime = new Date(utcTime.toLocaleString('en-US', { timeZone: city.timeZone }));
      return getTimeOfDay(cityTime);
    }
    return timeOfDay;
  })();
  
  const gradientClass = getGradientClass(city.id, virtualTimeOfDay);
  const isLight = isLightBackground(city.id, virtualTimeOfDay);
  const textShadowClass = isLight ? 'text-shadow-strong' : 'text-shadow-subtle';
  
  const sectionWidth = 100 / total;

  return (
    <motion.div
      className={`${gradientClass} relative flex flex-col justify-center items-center transition-all duration-1000 ease-in-out`}
      style={{ 
        width: `${sectionWidth}%`,
        minHeight: '100vh'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: index * 0.2 }}
    >
      {/* LAYER 3: Background gradients (z-0 - default) */}
      
      {/* Blurred transition edges */}
      {index > 0 && <div className="transition-blur-left" />}
      {index < total - 1 && <div className="transition-blur-right" />}
      <div className="transition-blur-top" />
      <div className="transition-blur-bottom" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden z-5">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 60, 0], 
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/3 rounded-full blur-2xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 20, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* LAYER 1: Time Display (highest z-index) */}
      <motion.div
        className="text-center relative px-8"
        style={{ zIndex: 6000 }}
        key={`${city.id}-${displayTime}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="instrument-serif font-normal mb-8 tracking-wide"
          style={{ 
            fontSize: 'clamp(4.5rem, 9vw, 12rem)',
            color: '#FFFFFF',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.4)'
          }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayTime}
        </motion.div>
        
        <motion.div className="space-y-3">
          <h2 
            className="instrument-serif font-medium"
            style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 4rem)',
              color: '#FFFFFF',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            {city.name}
          </h2>
          
          {/* Day/Night indicator - Custom Icons */}
          <motion.div 
            className="flex items-center justify-center mt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <img 
              src={(virtualTimeOfDay === 'morning' || virtualTimeOfDay === 'day') ? sunIcon : moonIcon}
              alt={(virtualTimeOfDay === 'morning' || virtualTimeOfDay === 'day') ? 'Day' : 'Night'}
              style={{
                width: '28px',
                height: '28px',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) brightness(1.1)',
                opacity: 0.9
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      

    </motion.div>
  );
};

const TopTimelineBar: React.FC<{
  timeZones: TimeZoneData[];
  currentHour: number;
  onTimeChange: (hour: number) => void;
}> = ({ timeZones, currentHour, onTimeChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ 
        position: 'absolute',
        top: '40px',
        left: '0',
        right: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      {/* 24 Dots */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: i === currentHour ? 'scale(1.8)' : i < currentHour ? 'scale(1.3)' : 'scale(1)',
              boxShadow: i === currentHour 
                ? '0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.6)' 
                : '0 0 8px rgba(255, 255, 255, 0.4)',
              opacity: i <= currentHour ? 1 : 0.7
            }}
            onClick={() => onTimeChange(i)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.5)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              const scale = i === currentHour ? '1.8' : i < currentHour ? '1.3' : '1';
              e.currentTarget.style.transform = `scale(${scale})`;
              e.currentTarget.style.boxShadow = i === currentHour 
                ? '0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.6)' 
                : '0 0 8px rgba(255, 255, 255, 0.4)';
            }}
          />
        ))}
      </div>
      
      {/* Hour labels underneath */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginTop: '15px'
      }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              width: '12px',
              display: 'flex',
              justifyContent: 'center',
              color: i % 6 === 0 ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              fontSize: '12px',
              fontFamily: 'Instrument Serif, serif',
              cursor: i % 6 === 0 ? 'pointer' : 'default',
              position: 'relative'
            }}
            onClick={() => i % 6 === 0 && onTimeChange(i)}
          >
            {i % 6 === 0 ? (
              <span style={{ 
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap'
              }}>
                {i.toString().padStart(2, '0')}:00
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const BottomBar: React.FC<{
  onAddCity: () => void;
  onShowSettings: () => void;
}> = ({ onAddCity, onShowSettings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-0 left-0 right-0 z-30 p-6"
    >
      <div className="flex justify-between items-center">
        {/* Brand */}
        <div className="instrument-serif text-sm text-white/70 tracking-wider text-shadow-subtle">
          TIMEFACE
        </div>
        
        {/* Center controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onShowSettings}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="instrument-serif text-sm text-shadow-subtle">Sky Clock</span>
          </button>
        </div>
        
        {/* Right controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onAddCity}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
          <Settings className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};

// Simple City Selector Modal
const CitySelector: React.FC<{
  selectedCities: string[];
  onAddCity: (cityId: string) => void;
  onClose: () => void;
}> = ({ selectedCities, onAddCity, onClose }) => {
  const availableCities = CITIES.filter(city => !selectedCities.includes(city.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="instrument-serif text-2xl text-white mb-6 text-center text-shadow-subtle">Add City</h3>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {availableCities.map((city) => (
            <motion.button
              key={city.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onAddCity(city.id);
                onClose();
              }}
              className="w-full p-4 text-left hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/5 hover:border-white/20"
            >
              <div className="instrument-serif text-white text-shadow-subtle">{city.name}</div>
              <div className="typewriter-font text-sm text-white/70">{city.country}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [timeZones, setTimeZones] = useState<TimeZoneData[]>([]);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [virtualHour, setVirtualHour] = useState<number | undefined>(undefined);

  const updateTimeZones = useCallback(() => {
    const newTimeZones = settings.selectedCities
      .map(cityId => getCityById(cityId))
      .filter((city): city is City => !!city)
      .map(city => getTimeZoneData(city, settings.timeFormat, settings.showSeconds));
    
    setTimeZones(newTimeZones);
  }, [settings]);

  const addCity = useCallback((cityId: string) => {
    if (!settings.selectedCities.includes(cityId) && settings.selectedCities.length < 6) {
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

      {/* Top timeline bar - ALWAYS RENDER */}
      <TopTimelineBar
        timeZones={timeZones}
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
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;