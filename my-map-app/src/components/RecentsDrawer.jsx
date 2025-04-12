import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBookmark } from 'react-icons/fa';

function RecentsDrawer() {
  const [hovering, setHovering] = useState(false);
  const recentItems = ['McKeldin Library', 'Stamp Student Union', 'Eppley Rec Center'];

  return (
    <div
      className={`fixed bottom-0 left-0 w-full transition-all duration-300 px-4 ${
        hovering ? 'h-64' : 'h-16'
      } z-20`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-t-2xl shadow-xl h-full p-4">
        <h2 className="text-md font-semibold mb-2">Recents</h2>
        <div className="space-y-2 overflow-y-auto max-h-44">
          {recentItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                {item}
              </div>
              <FaBookmark className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentsDrawer;