import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
  CircleMarker
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// UMD coordinates
const UMD_COORDINATES = [38.9869, -76.9426];

// Custom place marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Center map based on selected location
const MapController = ({ selectedPlace }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      const { lat, lng } = selectedPlace;
      map.setView([lat, lng], 16);
    } else {
      map.setView(UMD_COORDINATES, 15);
    }
  }, [selectedPlace, map]);

  return null;
};

const MapView = ({ selectedPlace }) => {
  const [geoData, setGeoData] = useState(null);
  const [safetyData, setSafetyData] = useState(null);

  useEffect(() => {
    fetch('/enrichedPaths.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data));

    fetch('/safety.geojson')
      .then((res) => res.json())
      .then((data) => setSafetyData(data));
  }, []);

  return (
    <div className="map-container" style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={UMD_COORDINATES}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Enriched path data with popups */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={(feature) => ({
              color: feature.properties.steep ? 'red' :
                     feature.properties.shaded ? 'green' :
                     feature.properties.food_nearby ? 'orange' :
                     'gray',
              weight: 4
            })}
            onEachFeature={(feature, layer) => {
              const tags = [];

              if (feature.properties.steep) tags.push("⛰️ Steep");
              if (feature.properties.shaded) tags.push("🌳 Shaded");
              if (feature.properties.food_nearby) tags.push("🍔 Food Nearby");
              if (feature.properties.safe) tags.push("🛟 Near Safety Resource");

              const message = tags.length > 0
                ? `<b>Tags:</b><br>${tags.join("<br>")}`
                : `No tags for this path`;

              layer.bindPopup(message);
            }}
          />
        )}

        {/* Blue safety dots */}
        {safetyData && safetyData.features.map((feature, idx) => {
          const [lng, lat] = feature.geometry.coordinates;
          return (
            <CircleMarker
              key={idx}
              center={[lat, lng]}
              radius={5}
              pathOptions={{ color: '#007bff', fillColor: '#007bff', fillOpacity: 0.8 }}
            >
              <Popup>🛟 Safety Resource</Popup>
            </CircleMarker>
          );
        })}

        {/* Selected location marker */}
        {selectedPlace && (
          <Marker
            position={[selectedPlace.lat, selectedPlace.lng]}
            icon={createCustomIcon()}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">{selectedPlace.name}</h3>
                <p className="text-gray-600">{selectedPlace.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        <MapController selectedPlace={selectedPlace} />
      </MapContainer>
    </div>
  );
};

export default MapView;
