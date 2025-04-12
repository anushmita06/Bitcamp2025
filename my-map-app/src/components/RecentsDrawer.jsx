import React from 'react';

function RecentsDrawer({ isOpen, onClose, recentSearches, onPlaceSelect }) {
  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Searches</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {recentSearches.length > 0 ? (
            <ul className="space-y-2">
              {recentSearches.map((place, index) => (
                <li 
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => onPlaceSelect(place)}
                >
                  <div className="font-medium text-gray-800">{place.name}</div>
                  <div className="text-sm text-gray-500">{place.address}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No recent searches
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecentsDrawer;