import axios from 'axios';
import { WeatherData } from '../types';

// Using environment variables for sensitive information
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';

export const getWeatherByLocation = async (location: string): Promise<WeatherData | null> => {
  try {
    // If no API key is provided, fall back to mock data
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      console.warn('No weather API key provided. Using mock data instead.');
      return getMockWeather(location);
    }

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
      }
    });

    if (response.status === 200) {
      const data = response.data;
      return {
        temperature: data.main.temp,
        condition: data.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fallback to mock data if API call fails
    return getMockWeather(location);
  }
};

// For development/demo purposes - return mock data if API key not available
export const getMockWeather = (location: string): WeatherData => {
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Windy', 'Snowy'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 30) + 1;
  
  return {
    temperature: randomTemp,
    condition: randomCondition,
    icon: `https://openweathermap.org/img/wn/01d@2x.png` // Default sunny icon
  };
}; 