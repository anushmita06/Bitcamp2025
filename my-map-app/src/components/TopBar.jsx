import React from 'react';

function TopBar() {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white z-10">
      <div className="text-lg font-semibold">10:41</div>
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold">
        AP
      </div>
    </div>
  );
}

export default TopBar;