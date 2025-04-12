import React from 'react';
import TopBar from './components/TopBar';
import SearchBar from './components/SearchBar';
import RecentsDropdown from './components/RecentsDropdown';
import MapView from './components/MapView';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      <TopBar />
      <SearchBar />
      <RecentsDropdown />
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
}

export default App;