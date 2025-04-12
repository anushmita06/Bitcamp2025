import React, { useEffect, useState } from 'react';

function TopBar() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const API_KEY = '3671ee2c5f5a504a6cb3842f0d62c478';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          icon: data.weather[0].icon,
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
      }
    });
  }, []);

  return (
    <div className="flex justify-between items-center">
      {weather ? (
        <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-md text-sm shadow backdrop-blur-md">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather"
            className="w-6 h-6"
          />
          <span>{weather.temp}°F</span>
        </div>
      ) : (
        <span className="text-sm text-gray-500">Loading weather...</span>
      )}

      <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center font-bold text-sm shadow">
        AP
      </div>
    </div>
  );
}

export default TopBar;