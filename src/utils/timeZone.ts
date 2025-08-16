import { City, TimeZoneData, MeetingTime } from '../types';

export const getCurrentTimeInTimeZone = (timeZone: string): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone }));
};

export const formatTime = (date: Date, format: '12' | '24' = '24', showSeconds: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12'
  };

  if (showSeconds) {
    options.second = '2-digit';
  }

  return date.toLocaleTimeString('en-US', options);
};

export const getTimeZoneOffset = (timeZone: string): string => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const targetTime = new Date(utc + (getTimeZoneOffsetInMinutes(timeZone) * 60000));
  const offset = getTimeZoneOffsetInMinutes(timeZone) / 60;
  
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.abs(Math.floor(offset));
  const minutes = Math.abs((offset % 1) * 60);
  
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getTimeZoneOffsetInMinutes = (timeZone: string): number => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const targetTime = new Date(now.toLocaleString('en-US', { timeZone }));
  const localTime = new Date(now.toLocaleString('en-US'));
  
  return (targetTime.getTime() - localTime.getTime()) / (1000 * 60);
};

export const isDaytime = (date: Date): boolean => {
  const hour = date.getHours();
  return hour >= 6 && hour < 18;
};

export const getTimeZoneData = (city: City, timeFormat: '12' | '24' = '24', showSeconds: boolean = false): TimeZoneData => {
  const currentTime = getCurrentTimeInTimeZone(city.timeZone);
  const formattedTime = formatTime(currentTime, timeFormat, showSeconds);
  const offset = getTimeZoneOffset(city.timeZone);
  const isDaytimeNow = isDaytime(currentTime);

  return {
    city,
    currentTime,
    formattedTime,
    offset,
    isDaytime: isDaytimeNow
  };
};

export const calculateTimeDifference = (timeZone1: string, timeZone2: string): number => {
  const offset1 = getTimeZoneOffsetInMinutes(timeZone1);
  const offset2 = getTimeZoneOffsetInMinutes(timeZone2);
  return Math.abs(offset1 - offset2) / 60;
};

export const findBestMeetingTimes = (cities: City[], workingHours: { start: number; end: number } = { start: 9, end: 17 }): MeetingTime[] => {
  const meetingTimes: MeetingTime[] = [];
  
  // Check every hour of the day
  for (let hour = 0; hour < 24; hour++) {
    const today = new Date();
    const baseTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0, 0);
    
    let totalScore = 0;
    const participants: { cityId: string; time: string }[] = [];
    
    cities.forEach(city => {
      const localTime = new Date(baseTime.toLocaleString('en-US', { timeZone: city.timeZone }));
      const localHour = localTime.getHours();
      
      // Score based on how close it is to working hours
      let score = 0;
      if (localHour >= workingHours.start && localHour <= workingHours.end) {
        score = 100;
      } else if (localHour >= workingHours.start - 2 && localHour <= workingHours.end + 2) {
        score = 50;
      } else if (localHour >= 6 && localHour <= 22) {
        score = 25;
      }
      
      totalScore += score;
      participants.push({
        cityId: city.id,
        time: formatTime(localTime, '24', false)
      });
    });
    
    const averageScore = totalScore / cities.length;
    
    if (averageScore > 0) {
      meetingTimes.push({
        time: formatTime(baseTime, '24', false),
        localTime: formatTime(baseTime, '24', false),
        participants,
        score: averageScore
      });
    }
  }
  
  return meetingTimes.sort((a, b) => b.score - a.score);
};

export const getGradientForTime = (timeZoneData: TimeZoneData[]): string => {
  if (timeZoneData.length === 0) return 'linear-gradient(135deg, #ff6b6b, #4ecdc4)';
  
  // Calculate average daytime percentage
  const daytimeCount = timeZoneData.filter(tz => tz.isDaytime).length;
  const daytimePercentage = daytimeCount / timeZoneData.length;
  
  if (daytimePercentage > 0.7) {
    // Mostly daytime - warm colors
    return 'linear-gradient(135deg, #ffecd2, #fcb69f)';
  } else if (daytimePercentage < 0.3) {
    // Mostly nighttime - cool colors
    return 'linear-gradient(135deg, #2C5364, #203A43)';
  } else {
    // Mixed - sunset/sunrise colors
    return 'linear-gradient(135deg, #ff6b6b, #4ecdc4)';
  }
};

export const getTimeOfDayEmoji = (isDaytime: boolean): string => {
  return isDaytime ? '☀️' : '🌙';
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};