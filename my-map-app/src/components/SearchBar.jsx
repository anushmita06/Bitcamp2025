import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSpinner, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import debounce from 'lodash/debounce';

const SearchBar = ({ onSearch, onOpenRecents }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCache, setSearchCache] = useState({});

  const handleSearch = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    // Check cache first
    if (searchCache[searchQuery]) {
      setSuggestions(searchCache[searchQuery]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      const formattedSuggestions = data.map(item => ({
        id: item.place_id,
        name: item.display_name.split(',')[0],
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));

      // Cache the results
      setSearchCache(prev => ({
        ...prev,
        [searchQuery]: formattedSuggestions
      }));

      setSuggestions(formattedSuggestions);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setError(null);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    onSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setError(null);
  };

  return (
    <div className="search-container">
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Where to?"
          value={query}
          onChange={handleInputChange}
          onFocus={() => onOpenRecents(true)}
        />
        {query && (
          <button
            className="clear-button"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="loading-spinner">
          <FaSpinner className="animate-spin" />
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <FaMapMarkerAlt className="suggestion-icon" />
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-address">{suggestion.address}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;