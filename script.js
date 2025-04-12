function initMap() {
  const map = L.map('map').setView([38.9869, -76.9426], 16);

  // Use CartoDB Positron (clean light map)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap, CartoDB'
  }).addTo(map);

  // Save reference
  window.appMap = map;

  // Try to access user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map.setView([lat, lon], 17);

        // Add blue circle to mark precise location
        L.circleMarker([lat, lon], {
          radius: 8,
          color: '#007bff',
          fillColor: '#007bff',
          fillOpacity: 0.8
        }).addTo(map).bindPopup("You are here").openPopup();
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
      }
    );
  } else {
    alert("Geolocation not supported by this browser.");
  }
}

function zoomTo(lat, lon) {
  if (window.appMap) {
    window.appMap.setView([lat, lon], 17);
  }
}

async function fetchWeather() {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
  const lat = 38.9869;
  const lon = -76.9426;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;
    document.getElementById("weather").innerText = `🌤️ ${temp}° ${condition}`;
  } catch (e) {
    document.getElementById("weather").innerText = "Weather unavailable";
  }
}

function openProfile() {
  alert("Profile modal or settings would appear here.");
}

initMap();
fetchWeather();