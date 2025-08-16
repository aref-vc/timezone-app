import React from 'react';
import { motion } from 'framer-motion';
import { X, Sun, Moon } from 'lucide-react';
import { TimeZoneData } from '../types';
import { getTimeOfDayEmoji } from '../utils';

interface TimeZoneCardProps {
  timeZone: TimeZoneData;
  index: number;
  onRemove: (cityId: string) => void;
  canRemove: boolean;
}

export const TimeZoneCard: React.FC<TimeZoneCardProps> = ({
  timeZone,
  index,
  onRemove,
  canRemove
}) => {
  const { city, formattedTime, offset, isDaytime } = timeZone;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        delay: index * 0.1,
        layout: { type: "spring", stiffness: 300, damping: 30 }
      }}
      className="glass-morphism p-6 rounded-2xl relative group hover:bg-white/10 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      {/* Remove Button */}
      {canRemove && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          onClick={() => onRemove(city.id)}
          className="absolute top-3 right-3 p-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
          title={`Remove ${city.name}`}
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      {/* Day/Night Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: isDaytime ? 0 : 180 }}
            transition={{ duration: 0.5 }}
            className={`p-2 rounded-full ${
              isDaytime 
                ? 'bg-yellow-500/20 text-yellow-300' 
                : 'bg-blue-500/20 text-blue-300'
            }`}
          >
            {isDaytime ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.div>
          <span className="text-white/60 text-sm">
            {isDaytime ? 'Day' : 'Night'}
          </span>
        </div>
        <span className="text-white/40 text-sm font-mono">
          {offset}
        </span>
      </div>

      {/* Time Display */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="text-center mb-4"
      >
        <div className="typewriter-font text-5xl md:text-6xl font-bold text-white mb-2 tracking-wider">
          {formattedTime}
        </div>
        <div className="text-white/50 text-sm">
          {timeZone.currentTime.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </motion.div>

      {/* City Information */}
      <div className="text-center">
        <h3 className="text-xl font-medium text-white/90 mb-1">
          {city.name}
        </h3>
        <p className="text-white/60 text-sm">
          {city.country}
        </p>
      </div>

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-white/20"
        whileHover={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};