import React, { useState, useEffect } from 'react';
import { FaHistory, FaTrash } from 'react-icons/fa';

function RecentsList({ onSelectPlace }) {
  const [recentSearches, setRecentSearches] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error('Error loading recent searches:', error);
        setRecentSearches([]);
      }
    }
  }, []);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } else {
      localStorage.removeItem('recentSearches');
    }
  }, [recentSearches]);

  const handleSelectPlace = (place) => {
    onSelectPlace(place);
    // Move the selected place to the top of the list
    setRecentSearches(prev => {
      const filtered = prev.filter(p => p.id !== place.id);
      return [place, ...filtered].slice(0, 5); // Keep only the 5 most recent
    });
  };

  const handleRemovePlace = (placeId, e) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    setRecentSearches(prev => prev.filter(place => place.id !== placeId));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
  };

  return (
    <div className="recents-list-container">
      <div 
        className="recents-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaHistory className="recents-icon" />
        <span className="recents-title">Recent Searches</span>
        <span className="recents-count">({recentSearches.length})</span>
        {isExpanded && recentSearches.length > 0 && (
          <button 
            className="clear-all-button"
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
          >
            Clear All
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="recents-list">
          {recentSearches.length > 0 ? (
            <ul>
              {recentSearches.map(place => (
                <li 
                  key={place.id} 
                  className="recent-item"
                  onClick={() => handleSelectPlace(place)}
                >
                  <div className="recent-item-content">
                    <div className="recent-item-name">{place.name}</div>
                    <div className="recent-item-address">{place.address}</div>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={(e) => handleRemovePlace(place.id, e)}
                    aria-label="Remove from recent searches"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-recent-searches">
              No recent searches yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecentsList; 