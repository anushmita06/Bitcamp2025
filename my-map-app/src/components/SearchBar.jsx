import React from 'react';

function SearchBar() {
  return (
    <div className="px-4 pt-2 pb-1 bg-white z-10">
      <input
        type="text"
        placeholder="Search or enter address"
        className="w-full px-4 py-2 rounded-xl border bg-gray-100 text-sm shadow-sm outline-none"
      />
    </div>
  );
}

export default SearchBar;