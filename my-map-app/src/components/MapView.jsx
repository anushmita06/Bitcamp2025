import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  useMapEvents,
  Polyline
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PathSelector from './PathSelector';
import RoutePlanner from './RoutePlanner';
import { FaTimes } from 'react-icons/fa';

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

// Component to handle map events
const MapEventHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    }
  });
  return null;
};

const MapView = ({ selectedPlace }) => {
  const [geoData, setGeoData] = useState(null);
  const [safetyData, setSafetyData] = useState(null);
  const [pathFilters, setPathFilters] = useState({
    steep: true,
    shaded: true,
    foodNearby: true,
    safe: true
  });
  const [filteredGeoData, setFilteredGeoData] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState(null);
  const [route, setRoute] = useState(null);
  const geoJsonRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    fetch('/enrichedPaths.geojson')
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        setFilteredGeoData(data);
      });

    fetch('/safety.geojson')
      .then((res) => res.json())
      .then((data) => setSafetyData(data));
  }, []);

  // Filter paths based on selected filters
  useEffect(() => {
    if (!geoData) return;

    const filtered = {
      ...geoData,
      features: geoData.features.filter(feature => {
        const props = feature.properties;
        
        // Check if the path matches any of the selected filters
        return (
          (pathFilters.steep && props.steep) ||
          (pathFilters.shaded && props.shaded) ||
          (pathFilters.foodNearby && props.food_nearby) ||
          (pathFilters.safe && props.safe)
        );
      })
    };

    setFilteredGeoData(filtered);
  }, [geoData, pathFilters]);

  // Handle filter changes from PathSelector
  const handleFilterChange = useCallback((filters) => {
    setPathFilters(filters);
  }, []);

  // Handle route changes from RoutePlanner
  const handleRouteChange = useCallback((newRoute) => {
    setRoute(newRoute);
  }, []);

  // Handle map click to clear highlighted path
  const handleMapClick = useCallback(() => {
    setHighlightedPath(null);
  }, []);

  // Handle path click to highlight it
  const handlePathClick = useCallback((e) => {
    const layer = e.target;
    const feature = layer.feature;
    
    // Set the highlighted path
    setHighlightedPath(feature);
    
    // Style the clicked path
    layer.setStyle({
      weight: 6,
      color: '#FF5722',
      opacity: 1
    });
    
    // Bring the layer to front
    layer.bringToFront();
  }, []);

  // Reset highlighted path when filters change
  useEffect(() => {
    setHighlightedPath(null);
  }, [pathFilters]);

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
        {filteredGeoData && (
          <GeoJSON
            ref={geoJsonRef}
            data={filteredGeoData}
            style={(feature) => {
              // If this is the highlighted path, give it special styling
              if (highlightedPath && highlightedPath.properties.id === feature.properties.id) {
                return {
                  weight: 6,
                  color: '#FF5722',
                  opacity: 1
                };
              }
              
              // Otherwise use the default styling based on properties
              return {
                color: feature.properties.steep ? 'red' :
                       feature.properties.shaded ? 'green' :
                       feature.properties.food_nearby ? 'orange' :
                       'gray',
                weight: 4
              };
            }}
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
              
              // Add click event to highlight the path
              layer.on({
                click: () => handlePathClick({ target: layer })
              });
            }}
          />
        )}

        {/* Route between buildings */}
        {route && (
          <Polyline
            positions={route.geometry.coordinates.map(coord => [coord[1], coord[0]])}
            color={route.properties.color}
            weight={route.properties.weight}
            opacity={0.8}
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
        <MapEventHandler onMapClick={handleMapClick} />
      </MapContainer>

      {/* Path selector component */}
      <PathSelector onFilterChange={handleFilterChange} />
      
      {/* Route planner component */}
      <RoutePlanner onRouteChange={handleRouteChange} selectedPlace={selectedPlace} />
      
      {/* Highlighted path info panel */}
      {highlightedPath && (
        <div className="path-info-panel">
          <div className="path-info-header">
            <h3>Path Details</h3>
            <button 
              className="close-button"
              onClick={() => setHighlightedPath(null)}
              aria-label="Close path info"
            >
              <FaTimes />
            </button>
          </div>
          <div className="path-info-content">
            <div className="path-info-tags">
              {highlightedPath.properties.steep && <span className="path-tag steep">⛰️ Steep</span>}
              {highlightedPath.properties.shaded && <span className="path-tag shaded">🌳 Shaded</span>}
              {highlightedPath.properties.food_nearby && <span className="path-tag food">🍔 Food Nearby</span>}
              {highlightedPath.properties.safe && <span className="path-tag safe">🛟 Safe Path</span>}
            </div>
            <div className="path-info-description">
              <p>This path has been selected for your route.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
