import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

function SafetyMarkers() {
  const map = useMap();

  useEffect(() => {
    fetch('/safety.geojson')
      .then(res => res.json())
      .then((safetyData) => {
        console.log("Loaded safety markers:", safetyData.features.length);
        L.geoJSON(safetyData, {
          pointToLayer: (feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 5,
              fillColor: '#007bff',
              color: '#007bff',
              weight: 1,
              opacity: 5,
              fillOpacity: 0.8
            }).bindPopup("🛟 Safety Resource")
        }).addTo(map);
      });
  }, [map]);

  return null;
}

function MapView() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('/enrichedPaths.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  return (
    <MapContainer
      center={[38.9869, -76.9426]}
      zoom={16}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <SafetyMarkers />

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
    </MapContainer>
  );
}

export default MapView;
