import React from 'react';
import { motion } from 'framer-motion';
import { X, Settings as SettingsIcon, Clock, Palette, Zap } from 'lucide-react';
import { AppSettings } from '../types';
import { GRADIENT_THEMES } from '../utils';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
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
        className="relative glass-morphism p-6 rounded-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Settings</h2>
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

        {/* Time Format */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-white/60" />
            <h3 className="text-white font-medium">Time Format</h3>
          </div>
          <div className="flex space-x-2">
            {(['12', '24'] as const).map((format) => (
              <motion.button
                key={format}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onUpdateSettings({ timeFormat: format })}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  settings.timeFormat === format
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                }`}
              >
                {format}-hour
              </motion.button>
            ))}
          </div>
        </div>

        {/* Show Seconds */}
        <div className="mb-6">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-white/60" />
              <span className="text-white font-medium">Show Seconds</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateSettings({ showSeconds: !settings.showSeconds })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.showSeconds ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <motion.div
                animate={{
                  x: settings.showSeconds ? 24 : 2,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </motion.button>
          </label>
        </div>

        {/* Gradient Theme */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Palette className="w-4 h-4 text-white/60" />
            <h3 className="text-white font-medium">Background Theme</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {GRADIENT_THEMES.map((theme) => (
              <motion.button
                key={theme.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onUpdateSettings({ gradientTheme: theme })}
                className={`p-3 rounded-xl border transition-all ${
                  settings.gradientTheme.name === theme.name
                    ? 'border-white/40'
                    : 'border-white/20 hover:border-white/30'
                }`}
              >
                <div
                  className="w-full h-8 rounded-lg mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.start}, ${theme.colors.end})`
                  }}
                />
                <div className="text-white/80 text-sm">{theme.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Auto Update Interval */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-white/60" />
            <h3 className="text-white font-medium">Update Interval</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: '1 second', value: 1000 },
              { label: '5 seconds', value: 5000 },
              { label: '10 seconds', value: 10000 },
              { label: '30 seconds', value: 30000 },
            ].map(({ label, value }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onUpdateSettings({ autoUpdateInterval: value })}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  settings.autoUpdateInterval === value
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Settings are automatically saved
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};