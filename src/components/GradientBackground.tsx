import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TimeZoneData } from '../types';
import { getGradientForTime } from '../utils';

interface GradientBackgroundProps {
  timeZones: TimeZoneData[];
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ timeZones }) => {
  const [gradient, setGradient] = useState('linear-gradient(135deg, #ff6b6b, #4ecdc4)');

  useEffect(() => {
    const newGradient = getGradientForTime(timeZones);
    setGradient(newGradient);
  }, [timeZones]);

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      animate={{
        background: gradient
      }}
      transition={{
        duration: 2,
        ease: "easeInOut"
      }}
    >
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
};