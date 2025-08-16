import React, { useState, useEffect } from 'react';

interface TimeZone {
  name: string;
  timezone: string;
  time: string;
}

function App() {
  const [timeZones, setTimeZones] = useState<TimeZone[]>([
    { name: 'London', timezone: 'Europe/London', time: '' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', time: '' },
    { name: 'New York', timezone: 'America/New_York', time: '' }
  ]);

  const updateTimes = () => {
    setTimeZones(zones => zones.map(zone => ({
      ...zone,
      time: new Date().toLocaleTimeString('en-US', {
        timeZone: zone.timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    })));
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: 'white',
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '2rem'
      }}>
        Time Zone App
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {timeZones.map((zone) => (
          <div
            key={zone.name}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
              {zone.name}
            </h2>
            <div style={{
              fontSize: '3rem',
              fontFamily: 'Courier, monospace',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              {zone.time}
            </div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
              {zone.timezone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;