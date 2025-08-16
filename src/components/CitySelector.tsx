import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Globe } from 'lucide-react';
import { CITIES, searchCities } from '../utils';

interface CitySelectorProps {
  selectedCities: string[];
  onAddCity: (cityId: string) => void;
  onClose: () => void;
  maxCities: number;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCities,
  onAddCity,
  onClose,
  maxCities
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(CITIES);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const availableCities = filteredCities.filter(
    city => !selectedCities.includes(city.id)
  );

  const isMaxReached = selectedCities.length >= maxCities;

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredCities(searchCities(searchQuery));
    } else {
      setFilteredCities(CITIES);
    }
  }, [searchQuery]);

  const handleAddCity = (cityId: string) => {
    if (!isMaxReached) {
      onAddCity(cityId);
      setSearchQuery('');
      if (selectedCities.length + 1 >= maxCities) {
        onClose();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && availableCities.length > 0) {
      handleAddCity(availableCities[0].id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative glass-morphism p-6 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add City</h2>
              <p className="text-white/60 text-sm">
                {selectedCities.length}/{maxCities} cities selected
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search cities..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>

        {/* Max cities warning */}
        {isMaxReached && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-xl"
          >
            <p className="text-orange-200 text-sm">
              Maximum number of cities reached. Remove a city to add a new one.
            </p>
          </motion.div>
        )}

        {/* Cities List */}
        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {availableCities.length > 0 ? (
              availableCities.map((city, index) => (
                <motion.button
                  key={city.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAddCity(city.id)}
                  disabled={isMaxReached}
                  className="w-full p-4 mb-2 text-left bg-white/5 hover:bg-white/10 disabled:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 group-hover:bg-white/20 rounded-lg transition-colors">
                      <MapPin className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {city.name}
                      </div>
                      <div className="text-white/60 text-sm">
                        {city.country}
                      </div>
                    </div>
                    <div className="text-white/40 text-sm font-mono">
                      {city.timeZone.split('/')[1]?.replace('_', ' ')}
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-white/40"
              >
                {searchQuery ? 'No cities found' : 'All cities are already selected'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Press Esc to close • Enter to select first result
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};