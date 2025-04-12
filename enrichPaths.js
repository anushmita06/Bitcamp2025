const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const safety = JSON.parse(fs.readFileSync('./safety.geojson'));
const food = JSON.parse(fs.readFileSync('./food.geojson'));
const turf = require('@turf/turf');

// Load the footpaths
const paths = JSON.parse(fs.readFileSync('./footpaths.geojson'));

(async () => {
    const enriched = [];
  
    for (const path of paths.features) {
        path.properties = path.properties || {};
        path.properties.safe = isSafe(path);
        path.properties.food_nearby = hasFoodNearby(path);
        path.properties.steep = await isSteep(path);
      
        if (path.properties.food_nearby) {
          console.log("🍕 Path near food:", path.geometry.coordinates);
        }
      
        enriched.push(path);
      }
  
    fs.writeFileSync('./my-map-app/public/enrichedPaths.geojson', JSON.stringify({
      type: 'FeatureCollection',
      features: enriched
    }, null, 2));
  
    console.log('✅ Enrichment complete with elevation data!');
  })();
  
// Save enriched GeoJSON to public folder
fs.writeFileSync('./my-map-app/public/enrichedPaths.geojson', JSON.stringify({
  type: "FeatureCollection",
  features: paths.features
}, null, 2));

function hasFoodNearby(path) {
    const line = turf.lineString(path.geometry.coordinates);
  
    return food.features.some(foodSpot => {
      const pt = turf.point(foodSpot.geometry.coordinates);
      const dist = turf.pointToLineDistance(pt, line, { units: 'meters' });
      return dist < 75; // mark as nearby if within 50 meters
    });
  }
  function isSafe(path) {
    const line = turf.lineString(path.geometry.coordinates);

    return safety.features.some(post => {
      const pt = turf.point(post.geometry.coordinates);
      const dist = turf.pointToLineDistance(pt, line, { units: 'meters' });
      return dist < 60;
    });
  }

  async function isSteep(path) {
    const coords = path.geometry.coordinates;
    if (coords.length < 2) return false;
  
    const [lon1, lat1] = coords[0];
    const [lon2, lat2] = coords[coords.length - 1];
  
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat1},${lon1}|${lat2},${lon2}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (!data.results || data.results.length < 2) {
        console.warn("⚠️ Elevation API returned incomplete data for path:", coords);
        return false;
      }
  
      const elev1 = data.results[0].elevation;
      const elev2 = data.results[1].elevation;
  
      const dist = turf.length(turf.lineString(coords), { units: 'meters' });
  
      if (dist === 0) return false;
  
      const slope = Math.abs(elev2 - elev1) / dist;
      return slope > 0.08; // or try 0.03 for more results
  
    } catch (err) {
      console.error("⛔ Elevation fetch failed:", err.message);
      return false;
    }
  }
  
  
console.log('✅ Enriched file created at: public/enrichedPaths.geojson');