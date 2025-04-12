import React, { useState, useEffect } from 'react';
import './App.css';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import RecentsDrawer from './components/RecentsDrawer';
import RecentsList from './components/RecentsList';
import WeatherWidget from './components/WeatherWidget';
import { FaCloudSun, FaCloudRain, FaCloud, FaSnowflake } from 'react-icons/fa';
import TopBar from './components/TopBar';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWeatherEnabled, setIsWeatherEnabled] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = (place) => {
    setSelectedPlace(place);
    // Add to recent searches
    setRecentSearches(prev => {
      const newSearches = [place, ...prev.filter(p => p.id !== place.id)].slice(0, 10);
      return newSearches;
    });
  };

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };

  const toggleWeather = () => {
    setIsWeatherEnabled(!isWeatherEnabled);
  };

  // Function to get weather icon based on description
  const getWeatherIcon = (description) => {
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

  // Fetch weather data
  useEffect(() => {
    if (!isWeatherEnabled) return;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        
        if (!apiKey) {
          throw new Error('Weather API key is missing');
        }
        
        // Use a simpler endpoint that's more likely to work
        let url;
        
        if (selectedPlace) {
          // Use selected place coordinates if available
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedPlace.lat}&lon=${selectedPlace.lng}&appid=${apiKey}&units=imperial`;
        } else {
          // Use default location (College Park, MD)
          url = `https://api.openweathermap.org/data/2.5/weather?q=College Park,MD&appid=${apiKey}&units=imperial`;
        }
        
        // Use a more reliable approach with fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Weather API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        
        // Validate the data structure
        if (!data.main || !data.weather || !data.weather[0]) {
          throw new Error('Invalid weather data format');
        }
        
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError('Failed to load weather data');
        setWeatherData(null); // Clear any previous data
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    
    return () => clearInterval(interval);
  }, [isWeatherEnabled, selectedPlace]);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 relative">
        <div className="weather-toggle-container">
          <button 
            className={`weather-toggle-button ${isWeatherEnabled ? 'enabled' : 'disabled'}`}
            onClick={toggleWeather}
          >
            {getWeatherIcon(weatherData?.weather?.[0]?.description)}
            <div className="weather-toggle-info">
              <p className="weather-toggle-temp">
                {weatherLoading ? 'Loading...' : 
                 weatherError ? '--°F' : 
                 weatherData ? `${Math.round(weatherData.main.temp)}°F` : '--°F'}
              </p>
              <p className="weather-toggle-desc">
                {weatherError ? 'Weather' : 
                 weatherData?.weather?.[0]?.description || 'Weather'}
              </p>
            </div>
          </button>
        </div>
        
        <div className="flex-grow">
          <MapView selectedPlace={selectedPlace} />
        </div>
        
        {/* Sidebar trigger area */}
        <div 
          className="sidebar-trigger"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        ></div>
        
        <div 
          className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="sidebar-indicator">
            <div className="triangle"></div>
          </div>
          <div className="sidebar-content">
            <SearchBar 
              onSearch={handleSearch} 
              onOpenRecents={setIsRecentsOpen} 
            />
            <RecentsList onSelectPlace={handleSearch} />
          </div>
        </div>
      </div>

      {/* Recents Drawer */}
      <RecentsDrawer 
        isOpen={isRecentsOpen}
        onClose={() => setIsRecentsOpen(false)}
        recentSearches={recentSearches}
        onPlaceSelect={handleSearch}
      />
    </div>
  );
}

export default App;
