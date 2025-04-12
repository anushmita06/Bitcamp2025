function initMap() {
    const map = createMap([38.9869, -76.9426], 16);
    addTileLayer(map);
    addMarker(map, [38.9876, -76.9447], "Stamp Student Union");
  }
  
  function createMap(center, zoom) {
    return L.map('map').setView(center, zoom);
  }
  
  function addTileLayer(map) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }
  
  function addMarker(map, coords, popupText) {
    L.marker(coords).addTo(map).bindPopup(popupText).openPopup();
  }
  
  initMap(); // runs on page load
  