import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRoute, FaTimes, FaSearch } from 'react-icons/fa';

const RoutePlanner = ({ onRouteChange, selectedPlace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [route, setRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activePoint, setActivePoint] = useState(null); // 'start' or 'end'
  const [pathData, setPathData] = useState(null);

  // Update route when start or end point changes
  useEffect(() => {
    if (startPoint && endPoint) {
      // For now, we'll create a simple straight line route
      // In a real implementation, you would use a routing service
      const route = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [startPoint.lng, startPoint.lat],
            [endPoint.lng, endPoint.lat]
          ]
        },
        properties: {
          color: '#4CAF50',
          weight: 5
        }
      };
      onRouteChange(route);
    } else {
      onRouteChange(null);
    }
  }, [startPoint, endPoint, onRouteChange]);

  // Set the selected place as the end point when it changes
  useEffect(() => {
    if (selectedPlace) {
      setEndPoint(selectedPlace);
    }
  }, [selectedPlace]);

  // Handle search for locations
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Fetch path data if not already loaded
      if (!pathData) {
        const response = await fetch('/enrichedPaths.geojson');
        const data = await response.json();
        setPathData(data);
      }

      // Filter paths based on search query
      const query = searchQuery.toLowerCase();
      const filteredPaths = pathData.features.filter(path => {
        // Check if the path properties match the search query
        const props = path.properties;
        const pathName = props.name || '';
        const pathType = props.highway || '';
        const pathSurface = props.surface || '';
        
        return (
          pathName.toLowerCase().includes(query) ||
          pathType.toLowerCase().includes(query) ||
          pathSurface.toLowerCase().includes(query) ||
          (props.steep && 'steep'.includes(query)) ||
          (props.shaded && 'shaded'.includes(query)) ||
          (props.food_nearby && 'food'.includes(query)) ||
          (props.safe && 'safe'.includes(query))
        );
      });
      
      // Format the filtered paths as search results
      const results = filteredPaths.map(path => {
        // Get the midpoint of the path for display
        const coords = path.geometry.coordinates;
        const midIndex = Math.floor(coords.length / 2);
        const [lng, lat] = coords[midIndex];
        
        return {
          name: `Path: ${path.properties.name || path.properties.highway || 'Unnamed path'}`,
          lat: lat,
          lng: lng,
          pathId: path.id,
          properties: path.properties
        };
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a location from search results
  const handleSelectLocation = (location) => {
    if (!startPoint) {
      setStartPoint(location);
    } else if (!endPoint) {
      setEndPoint(location);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Clear the route
  const handleClearRoute = () => {
    setStartPoint(null);
    setEndPoint(null);
    onRouteChange(null);
  };

  return (
    <div className="route-planner-container">
      <button 
        className="route-planner-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle route planner"
      >
        <FaRoute />
      </button>

      {isOpen && (
        <div className="route-planner-panel">
          <div className="route-planner-header">
            <h3>Route Planner</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close route planner"
            >
              <FaTimes />
            </button>
          </div>

          <div className="route-planner-content">
            <div className="route-points">
              <div className="route-point start">
                <div className="point-label">Start:</div>
                <div className="point-value">
                  {startPoint ? startPoint.name : 'Not selected'}
                </div>
                <button 
                  className="select-point-button"
                  onClick={() => setActivePoint('start')}
                >
                  <FaMapMarkerAlt />
                </button>
              </div>

              <div className="route-point end">
                <div className="point-label">End:</div>
                <div className="point-value">
                  {endPoint ? endPoint.name : 'Not selected'}
                </div>
                <button 
                  className="select-point-button"
                  onClick={() => setActivePoint('end')}
                >
                  <FaMapMarkerAlt />
                </button>
              </div>
            </div>

            {activePoint && (
              <div className="route-search">
                <div className="search-input-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder={`Search for ${activePoint} point...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button 
                    className="search-button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <FaSearch />
                  </button>
                </div>

                {isSearching && (
                  <div className="search-loading">
                    Searching...
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="search-result-item"
                        onClick={() => handleSelectLocation(result)}
                      >
                        <div className="result-name">{result.name}</div>
                        {result.properties && (
                          <div className="result-properties">
                            {result.properties.steep && (
                              <span className="property-tag steep">Steep</span>
                            )}
                            {result.properties.shaded && (
                              <span className="property-tag shaded">Shaded</span>
                            )}
                            {result.properties.food_nearby && (
                              <span className="property-tag food">Food Nearby</span>
                            )}
                            {result.properties.safe && (
                              <span className="property-tag safe">Safe</span>
                            )}
                            {result.properties.surface && (
                              <span className="property-tag surface">
                                {result.properties.surface}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {route && (
              <div className="route-actions">
                <button 
                  className="clear-route-button"
                  onClick={handleClearRoute}
                >
                  Clear Route
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;

<style jsx>{`
  .result-properties {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }

  .property-tag {
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: #f0f0f0;
  }

  .property-tag.steep {
    background-color: #ffebee;
    color: #c62828;
  }

  .property-tag.shaded {
    background-color: #e3f2fd;
    color: #1565c0;
  }

  .property-tag.food {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  .property-tag.safe {
    background-color: #f3e5f5;
    color: #6a1b9a;
  }

  .property-tag.surface {
    background-color: #fff3e0;
    color: #ef6c00;
  }
`}</style> 