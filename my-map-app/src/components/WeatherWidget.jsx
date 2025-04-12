import React, { useState, useEffect } from 'react';
import { FaCloudSun, FaCloudRain, FaCloud, FaSnowflake } from 'react-icons/fa';

function WeatherWidget({ isEnabled }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isEnabled) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        
        if (!apiKey) {
          throw new Error('Weather API key is missing');
        }
        
        console.log('WeatherWidget: Fetching weather with API key:', apiKey.substring(0, 5) + '...');
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=College Park,MD&appid=${apiKey}&units=imperial`
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Weather API error:', response.status, errorText);
          throw new Error(`Weather data fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('WeatherWidget: Weather data received');
        setWeather(data);
        setDescription(data.weather[0].description);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    
    return () => clearInterval(interval);
  }, [isEnabled]);

  const getWeatherIcon = () => {
    if (!description) return <FaCloudSun />;
    
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) {
      return <FaCloudRain />;
    } else if (desc.includes('snow') || desc.includes('sleet')) {
      return <FaSnowflake />;
    } else if (desc.includes('cloud')) {
      return <FaCloud />;
    } else {
      return <FaCloudSun />;
    }
  };

  if (!isEnabled) return null;

  if (loading) {
    return (
      <div className="weather-widget loading">
        Loading weather data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        {error}
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-icon">
        {getWeatherIcon()}
      </div>
      <h2 className="weather-temp">
        {weather ? `${Math.round(weather.main.temp)}°F` : '--°F'}
      </h2>
      <p className="weather-desc">
        {description ? description.charAt(0).toUpperCase() + description.slice(1) : 'Weather'}
      </p>
      <div className="weather-details">
        <div className="weather-detail-item">
          <span className="weather-detail-label">Feels like</span>
          <span className="weather-detail-value">{Math.round(weather.main.feels_like)}°F</span>
        </div>
        <div className="weather-detail-item">
          <span className="weather-detail-label">Humidity</span>
          <span className="weather-detail-value">{weather.main.humidity}%</span>
        </div>
        <div className="weather-detail-item">
          <span className="weather-detail-label">Wind</span>
          <span className="weather-detail-value">{Math.round(weather.wind.speed)} mph</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget; 