const fs = require('fs');
const turf = require('@turf/turf');

// Load the footpaths
const paths = JSON.parse(fs.readFileSync('./footpaths.geojson'));

// Simple enrichment: add "shaded" randomly (for now, just test structure)
paths.features.forEach((path, index) => {
  path.properties = path.properties || {};
  path.properties.shaded = Math.random() > 0.5;
  path.properties.steep = Math.random() > 0.5;
  path.properties.food_nearby = Math.random() > 0.5;
});

// Save enriched GeoJSON to public folder
fs.writeFileSync('./public/enrichedPaths.geojson', JSON.stringify({
  type: "FeatureCollection",
  features: paths.features
}, null, 2));

console.log('✅ Enriched file created at: public/enrichedPaths.geojson');