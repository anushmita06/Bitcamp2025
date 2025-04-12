import React, { useState } from 'react';

function RecentsDropdown() {
  const [open, setOpen] = useState(false);
  const recentItems = ['McKeldin Library', 'Stamp Student Union', 'Eppley Rec Center'];

  return (
    <div className="px-4 bg-white z-10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-2 font-medium text-sm"
      >
        Recents ▾
      </button>
      {open && (
        <div className="bg-white border rounded-lg shadow-md mt-1">
          {recentItems.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentsDropdown;