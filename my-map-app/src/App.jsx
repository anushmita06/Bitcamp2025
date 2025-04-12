import React from 'react';
import MapView from './components/MapView';
import TopBar from './components/TopBar';
import SearchBar from './components/SearchBar';
import RecentsDropdown from './components/RecentsDropdown';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      <TopBar />
      <SearchBar />
      <RecentsDropdown />
      <MapView />
    </div>
  );
}

export default App;