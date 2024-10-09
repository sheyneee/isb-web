import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import barangayLogo from '../../assets/images/iServe-Barangay-home-logo.png';
import defaultProfile from '../../assets/icons/default-profile.png';
import arrowDown from '../../assets/icons/arrowdown.png';

const ResidentHeader = ({ userName, userRole, profilePic, handleLogout, residentData }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/Resident/Profile', { state: { residentData } });
    };

    return (
        <div className="flex items-center justify-between bg-[#1346AC] p-4 relative">
            <img src={barangayLogo} alt="Logo" className="w-30 h-10 ml-3" />

            {/* Hamburger Menu for Smaller Screens */}
            <div className="lg:hidden">
                <div
                    className={classNames('tham tham-e-squeeze tham-w-8', { 'tham-active': menuOpen })}
                    onClick={toggleMenu}
                >
                    <div className="tham-box">
                        <div className="tham-inner bg-white" />
                    </div>
                </div>

                {/* Dropdown Menu for Hamburger */}
                {menuOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-gray-200 rounded-lg shadow-lg z-50">
                        <div
                            className="block px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold"
                            onClick={handleProfileClick}
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

            {/* Main Menu for Larger Screens */}
            <div className="hidden lg:flex items-center">
                <div className="flex flex-col justify-between text-center text-white mr-3">
                    <span className="block font-bold text-xl">{userName}</span>
                    <span className="block text-lg text-end">{userRole}</span>
                </div>
                <div className="relative">
                    <div className="w-12 h-12 relative flex-shrink-0">
                        <img
                            src={profilePic || defaultProfile}
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
                            <div
                                className="block px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold"
                                onClick={handleProfileClick}
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

export default ResidentHeader;
