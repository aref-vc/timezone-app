export const getGradientClass = (cityId: string, timeOfDay: 'morning' | 'day' | 'evening' | 'night'): string => {
  const normalizedCityId = cityId.replace('-', '').toLowerCase();
  
  // Map city IDs to gradient class names
  const cityGradientMap: { [key: string]: string } = {
    'london': 'london',
    'tokyo': 'tokyo', 
    'newyork': 'newyork',
    'losangeles': 'losangeles',
    'sydney': 'sydney',
    'dubai': 'dubai',
    'paris': 'paris',
    'singapore': 'singapore'
  };
  
  const gradientCity = cityGradientMap[normalizedCityId] || 'default';
  return `gradient-${gradientCity}-${timeOfDay}`;
};

export const isLightBackground = (cityId: string, timeOfDay: 'morning' | 'day' | 'evening' | 'night'): boolean => {
  return (timeOfDay === 'morning' || timeOfDay === 'day') && 
         ['london', 'tokyo', 'new-york', 'newyork'].includes(cityId.replace('-', ''));
};