import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// UMD College Park coordinates
const UMD_COORDINATES = [38.9869, -76.9426];

// Custom marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Map controller component to handle map updates
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
  return (
    <div className="map-container" style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={UMD_COORDINATES}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          // Force a resize after the map is created
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Selected place marker */}
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