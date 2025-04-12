import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar() {
  return (
    <div className="bg-white/80 px-4 py-3 rounded-xl flex items-center shadow backdrop-blur-md">
      <FaSearch className="text-gray-500 mr-3" />
      <input
        type="text"
        placeholder="Where to?"
        className="bg-transparent outline-none text-sm w-full"
      />
    </div>
  );
}

export default SearchBar;