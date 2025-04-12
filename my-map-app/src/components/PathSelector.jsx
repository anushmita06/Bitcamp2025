import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const PathSelector = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    steep: true,
    shaded: true,
    foodNearby: true,
    safe: true
  });

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const toggleAll = (value) => {
    setFilters({
      steep: value,
      shaded: value,
      foodNearby: value,
      safe: value
    });
  };

  return (
    <div className="path-selector-container">
      <button 
        className="path-selector-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle path filters"
      >
        <FaFilter />
      </button>

      {isOpen && (
        <div className="path-selector-panel">
          <div className="path-selector-header">
            <h3>Path Filters</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
            >
              <FaTimes />
            </button>
          </div>

          <div className="path-selector-actions">
            <button 
              className="select-all-button"
              onClick={() => toggleAll(true)}
            >
              Select All
            </button>
            <button 
              className="deselect-all-button"
              onClick={() => toggleAll(false)}
            >
              Deselect All
            </button>
          </div>

          <div className="path-selector-filters">
            <label className="filter-item">
              <input
                type="checkbox"
                checked={filters.steep}
                onChange={() => toggleFilter('steep')}
              />
              <span className="filter-icon">⛰️</span>
              <span className="filter-label">Steep Paths</span>
            </label>

            <label className="filter-item">
              <input
                type="checkbox"
                checked={filters.shaded}
                onChange={() => toggleFilter('shaded')}
              />
              <span className="filter-icon">🌳</span>
              <span className="filter-label">Shaded Paths</span>
            </label>

            <label className="filter-item">
              <input
                type="checkbox"
                checked={filters.foodNearby}
                onChange={() => toggleFilter('foodNearby')}
              />
              <span className="filter-icon">🍔</span>
              <span className="filter-label">Food Nearby</span>
            </label>

            <label className="filter-item">
              <input
                type="checkbox"
                checked={filters.safe}
                onChange={() => toggleFilter('safe')}
              />
              <span className="filter-icon">🛟</span>
              <span className="filter-label">Safe Paths</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathSelector; 