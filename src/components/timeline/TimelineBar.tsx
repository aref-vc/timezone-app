import React from 'react';
import { motion } from 'framer-motion';

interface TimelineBarProps {
  currentHour: number;
  onTimeChange: (hour: number) => void;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({ 
  currentHour, 
  onTimeChange 
}) => {
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