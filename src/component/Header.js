import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import barangayLogo from '../assets/images/iServe-Barangay-home-logo.png';
import defaultProfile from '../assets/icons/default-profile.png';
import arrowDown from '../assets/icons/arrowdown.png';

const Header = ({ userName, userRole, profilePic, handleLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between bg-[#1346AC] p-4">
            <img src={barangayLogo} alt="Logo" className="w-30 h-10 ml-3" />
            <div className="flex items-center">
                <div className="mr-4 text-white">
                    <span className="block font-bold text-xl">{userName}</span>
                    <span className="block text-lg ml-12">{userRole}</span>
                </div>
                <div className="relative mr-5">
                    <div className="w-12 h-12 relative">
                        <img
                            src={profilePic ? profilePic : defaultProfile} 
                            alt="Profile"
                            className="w-full h-full rounded-full cursor-pointer object-cover" 
                            onClick={toggleDropdown}
                        />
                        <img
                            src={arrowDown}
                            alt="Arrow Down"
                            className="w-4 h-4 absolute bottom-0 right-0 mb-0.5 mr-0.5 cursor-pointer"
                            onClick={toggleDropdown}
                        />
                    </div>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-gray-200 rounded-lg shadow-lg">
                            <div
                                className="block px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold"
                            >
                                Profile
                            </div>
                            <div
                                className="block px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold"
                                onClick={handleLogout}
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
