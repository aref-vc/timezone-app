import React from 'react';
import { motion } from 'framer-motion';
import type { TimeZoneData } from '../../types';
import { formatTime, getTimeOfDay } from '../../utils/timeZone';
import { getGradientClass } from '../../utils/styling';
import sunIcon from '../../assets/sun-fill.svg';
import moonIcon from '../../assets/moon-stars-fill.svg';

interface TimeZoneSectionProps {
  timeZone: TimeZoneData;
  index: number;
  total: number;
  virtualHour?: number;
}

export const TimeZoneSection: React.FC<TimeZoneSectionProps> = ({ 
  timeZone, 
  index, 
  total, 
  virtualHour 
}) => {
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

      {/* Time Display */}
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
          
          {/* Day/Night indicator */}
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