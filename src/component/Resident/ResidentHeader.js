import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import barangayLogo from '../../assets/images/iServe-Barangay-home-logo.png';
import defaultProfile from '../../assets/icons/default-profile.png';
import arrowDown from '../../assets/icons/arrowdown.png';

const ResidentHeader = ({ userName, userRole, handleLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // State for the hamburger menu

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between bg-[#1346AC] p-4">
            <img src={barangayLogo} alt="Logo" className="w-30 h-10 ml-3" />

            {/* Hamburger Menu for Smaller Screens */}
            <div className="lg:hidden">
                <label className="btn btn-circle swap swap-rotate">
                    {/* This hidden checkbox controls the state */}
                    <input type="checkbox" onChange={toggleMenu} checked={menuOpen} />

                    {/* Hamburger icon */}
                    <svg
                        className="swap-off fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 512 512"
                    >
                        <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                    </svg>

                    {/* Close icon */}
                    <svg
                        className="swap-on fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 512 512"
                    >
                        <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                    </svg>
                </label>

                {/* Dropdown Menu for Hamburger */}
                {menuOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-gray-200 rounded-lg shadow-lg z-50">
                        <div className="block px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                )}
            </div>

            {/* Main Menu for Larger Screens */}
            <div className="hidden lg:flex items-center">
                <div className="mr-4 text-white">
                    <span className="block font-bold text-xl">{userName}</span>
                    <span className="block text-lg ml-12">{userRole}</span>
                </div>
                <div className="relative mr-5">
                    <div className="w-12 h-12 relative">
                        <img
                            src={defaultProfile}
                            alt="Profile"
                            className="w-full h-full rounded-full cursor-pointer"
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
                        <div className="absolute right-0 mt-3 w-48 bg-gray-200 rounded-lg shadow-lg z-50">
                            <div className="block px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold" onClick={handleLogout}>
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResidentHeader;
