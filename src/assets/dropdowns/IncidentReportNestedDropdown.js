import React, { useState } from 'react';

const IncidentReportNestedDropdown = ({ handleSortChange, selectedSortText }) => {
    const [showNestedDropdown, setShowNestedDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    const handleDateSortChange = (direction) => {
        handleSortChange(direction);
        setShowNestedDropdown(false); // Close the main dropdown
        setShowDateDropdown(false);   // Close the date submenu
    };

    return (
        <div className="relative ml-4">
            {/* Main Dropdown Button */}
            <button
                id="sortByButton"
                onClick={() => setShowNestedDropdown(!showNestedDropdown)}
                className="block appearance-none w-64 bg-white text-[#1346AC] font-semibold py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 overflow-hidden text-ellipsis whitespace-nowrap"
            >
                {selectedSortText}
                <svg
                    className="inline-block ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {/* Main Dropdown Menu */}
            <div
                id="sortByDropdown"
                className={`absolute z-10 bg-white divide-y divide-gray-100 rounded shadow w-44 mt-2 ${showNestedDropdown ? 'block' : 'hidden'}`}
            >
                <ul className="py-1 text-sm text-[#1346AC]">
                    {/* Date Dropdown */}
                    <li className="relative group">
                        <button
                            onClick={() => setShowDateDropdown(!showDateDropdown)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-medium"
                        >
                            Date
                        </button>
                        {showDateDropdown && (
                            <ul className="absolute left-0 mt-2 bg-white shadow-md rounded w-full z-20">
                                <li>
                                    <button
                                        onClick={() => handleDateSortChange('desc')}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    >
                                        Latest to Oldest
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleDateSortChange('asc')}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    >
                                        Oldest to Latest
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default IncidentReportNestedDropdown;
