import React from 'react';
import TopBar from './components/TopBar';
import SearchBar from './components/SearchBar';
import RecentsDrawer from './components/RecentsDrawer';
import MapView from './components/MapView';

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      <MapView />

      <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-4 space-y-3">
        <TopBar />
        <SearchBar />
      </div>

      <RecentsDrawer />
    </div>
  );
}

export default App;
