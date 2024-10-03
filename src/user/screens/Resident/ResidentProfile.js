import React from 'react';
import ResidentHeader from './ResidentHeader'; 
import ResidentNav from './ResidentNav'; 
import defaultProfile from '../../assets/icons/default-profile.png';

const ResidentProfile = ({ userName, userRole, profilePic, handleLogout }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100"> 
            {/* Fixed Header */}
            <div className="fixed top-0 w-full z-50">
                <ResidentHeader 
                    userName={userName} 
                    userRole={userRole} 
                    handleLogout={handleLogout} 
                    profilePic={profilePic || defaultProfile} 
                />
            </div>

            <div className="flex-1 overflow-y-auto pt-20">
                <div className="flex h-full">
                    {/* Resident Navigation on the left */}
                    <div className="w-1/4 h-full overflow-y-auto"> {/* Added overflow to enable scrolling */}
                        <ResidentNav />
                    </div>

                    {/* Profile Information on the right */}
                    <div className="w-3/4 h-full p-4 bg-white shadow-md rounded-lg">
                        {/* User Profile Section */}
                        <div className="flex items-center mb-6">
                            <img
                                src={profilePic || defaultProfile} // Use profilePic or default
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold">Katrina Juan</h1>
                                <div className="bg-green-200 text-green-800 text-sm font-semibold rounded-full px-3 py-1 mt-1">
                                    Approved Resident
                                </div>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="flex mb-4">
                            {/* Vertical Line */}
                            <div className="w-1 bg-blue-600"></div>
                            <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-inner">
                                <h2 className="text-lg font-bold mb-2">Personal Information</h2>
                                <p>Resident ID No.: R-2024-0001</p>
                                <p>Birthdate: 06/22/2003</p>
                                <p>Sex: Female</p>
                                <p>Age: 22</p>
                                <p>Birthplace: Manila</p>
                                <p>Occupation Status: Student</p>
                                <p>Nationality: Filipino</p>
                                <p>Civil Status: Single</p>
                                <p>Email Address: 1</p>
                                <p>Contact Number: 09123456789</p>
                            </div>
                        </div>

                        {/* Permanent Address Section */}
                        <div className="flex mb-4">
                            {/* Vertical Line */}
                            <div className="w-1 bg-blue-600"></div>
                            <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-inner">
                                <h2 className="text-lg font-bold mb-2">Permanent Address</h2>
                                <p>House No.: Permanent</p>
                                <p>Street: Permanent</p>
                                <p>Unit/Floor/Room No.: Permanent</p>
                                <p>Building: Permanent</p>
                                <p>Block No.: Permanent</p>
                                <p>Lot No.: Permanent</p>
                                <p>Phase No.: Permanent</p>
                                <p>Subdivision: Permanent</p>
                                <p>Barangay: 52 - IPIL</p>
                                <p>City/Municipality: Cavite City</p>
                                <p>Province: Cavite</p>
                                <p>Region: IV-A CALABARZON</p>
                            </div>
                        </div>

                        {/* Present Address Section */}
                        <div className="flex mb-4">
                            {/* Vertical Line */}
                            <div className="w-1 bg-blue-600"></div>
                            <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-inner">
                                <h2 className="text-lg font-bold mb-2">Present Address</h2>
                                <p>House No.: Present</p>
                                <p>Street: Present</p>
                                <p>Unit/Floor/Room No.: Present</p>
                                <p>Building: Present</p>
                                <p>Block No.: Present</p>
                                <p>Lot No.: Present</p>
                                <p>Phase No.: Present</p>
                                <p>Subdivision: Present</p>
                                <p>Barangay: Barangay 15</p>
                                <p>City/Municipality: Pasay City</p>
                                <p>Region: NCR</p>
                            </div>
                        </div>

                        {/* Household Information Section */}
                        <div className="flex mb-4">
                            {/* Vertical Line */}
                            <div className="w-1 bg-blue-600"></div>
                            <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-inner">
                                <h2 className="text-lg font-bold mb-2">Household Information</h2>
                                <p>Household No.: 2024-0001</p>
                                <p>Contact Number: 09777124273</p>
                                <p>Family Members:</p>
                                <p>1. Yunice Gumban</p>
                                <p>2. Euclid Quemada</p>
                            </div>
                        </div>

                        {/* Update Info Button */}
                        <div className="flex justify-center mt-6">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
                                Update Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentProfile;