import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Menu } from 'lucide-react';

interface BottomBarProps {
  onAddCity: () => void;
  onShowSettings: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ onAddCity, onShowSettings }) => {
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