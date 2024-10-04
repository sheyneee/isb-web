import React from 'react';

const BotResponse = ({ handleOptionClick }) => {

  return (
    <div className="p-4 bg-gray-100 rounded-lg  max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-4">What would you like to do?</h3>
      <div className="flex flex-col space-y-2 font-semibold">
        <button
          className="py-2 px-4 bg-[#4667c6] text-white rounded hover:bg-blue-600"
          onClick={() => handleOptionClick('chat with official')}
        >
          Chat with Official
        </button>
        <button
          className="py-2 px-4 bg-[#00cade]  text-white rounded hover:bg-[#29bdca]"
          onClick={() => handleOptionClick('document request history')}
        >
          Document Request History
        </button>

        {/* Button for Announcements */}
        <button
          className="py-2 px-4 bg-[#01b4f7] text-white rounded hover:bg-[#2ca5d1]"
          onClick={() => handleOptionClick('announcements')}
        >
          Announcements
        </button>

        {/* Button for Incident Report */}
        <button
          className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => handleOptionClick('Incident Report')}
        >
          Incident Report
        </button>
      </div>
    </div>
  );
};

export default BotResponse;
