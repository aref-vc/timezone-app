import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, Star, Calendar, Copy } from 'lucide-react';
import { TimeZoneData, MeetingTime } from '../types';
import { findBestMeetingTimes, getCityById } from '../utils';

interface MeetingOptimizerProps {
  timeZones: TimeZoneData[];
  onClose: () => void;
}

export const MeetingOptimizer: React.FC<MeetingOptimizerProps> = ({
  timeZones,
  onClose
}) => {
  const [workingHours, setWorkingHours] = useState({ start: 9, end: 17 });
  const [meetingTimes, setMeetingTimes] = useState<MeetingTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<MeetingTime | null>(null);

  useEffect(() => {
    const cities = timeZones.map(tz => tz.city);
    const bestTimes = findBestMeetingTimes(cities, workingHours);
    setMeetingTimes(bestTimes.slice(0, 10)); // Show top 10 suggestions
  }, [timeZones, workingHours]);

  const handleCopyTime = (meetingTime: MeetingTime) => {
    const text = `Meeting Time: ${meetingTime.time}\n\n` +
      meetingTime.participants.map(p => {
        const city = getCityById(p.cityId);
        return `${city?.name}: ${p.time}`;
      }).join('\n');
    
    navigator.clipboard.writeText(text);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20';
    if (score >= 40) return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
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
        className="relative glass-morphism p-6 rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Meeting Optimizer</h2>
              <p className="text-white/60 text-sm">
                Find the best time for all {timeZones.length} time zones
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

        {/* Working Hours Settings */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Working Hours Preference</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-white/70 text-sm">Start:</label>
              <select
                value={workingHours.start}
                onChange={(e) => setWorkingHours(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i} className="bg-gray-800">
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-white/70 text-sm">End:</label>
              <select
                value={workingHours.end}
                onChange={(e) => setWorkingHours(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i} className="bg-gray-800">
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meeting Times List */}
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Best Meeting Times</span>
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {meetingTimes.map((meetingTime, index) => (
                  <motion.button
                    key={`${meetingTime.time}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedTime(meetingTime)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedTime?.time === meetingTime.time
                        ? 'bg-white/20 border-white/40'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="typewriter-font text-lg text-white">
                        {meetingTime.time}
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs ${getScoreColor(meetingTime.score)}`}>
                        {getScoreLabel(meetingTime.score)}
                      </div>
                    </div>
                    <div className="text-white/60 text-sm">
                      Score: {Math.round(meetingTime.score)}/100
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Selected Time Details */}
          <div>
            {selectedTime ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Meeting Details</span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyTime(selectedTime)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-white/60" />
                  </motion.button>
                </div>

                <div className="mb-4">
                  <div className="typewriter-font text-2xl text-white mb-2">
                    {selectedTime.time}
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-lg text-sm ${getScoreColor(selectedTime.score)}`}>
                    <Star className="w-3 h-3 mr-1" />
                    {getScoreLabel(selectedTime.score)} ({Math.round(selectedTime.score)}/100)
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white/80 font-medium">Times by City:</h4>
                  {selectedTime.participants.map((participant) => {
                    const city = getCityById(participant.cityId);
                    if (!city) return null;
                    
                    return (
                      <div key={participant.cityId} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{city.name}</div>
                          <div className="text-white/60 text-sm">{city.country}</div>
                        </div>
                        <div className="typewriter-font text-white">
                          {participant.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <Clock className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">
                  Select a meeting time to see details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Times are optimized based on working hours preference • Higher scores indicate better times for all participants
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};