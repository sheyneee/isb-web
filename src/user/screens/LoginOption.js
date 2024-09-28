import React, { useState } from 'react';
import Login from './Login'; // Import the Login component for Barangay Officials
import ResidentLogin from './Resident/ResidentLogin'; // Import the Resident Login component
import backgroundImage from '../../assets/images/login.jpg'; 
import barangayLogo from '../../assets/images/iServe-Barangay-login.png';
import logoText from '../../assets/images/iServeBarangay-Text-login.png';

const LoginOption = () => {
    const [showLogin, setShowLogin] = useState('resident'); 

    return (
        <div className="relative h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            {/* Apply blur to the background */}
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            
            {/* Floating Login Option */}
            <div className="relative z-10 flex justify-center items-center h-full">
                <div className="bg-white rounded-lg p-10 shadow-lg w-full max-w-lg">
                    <div className="flex flex-col items-center">
                        <img src={barangayLogo} alt="Barangay Logo" className="mb-5" style={{ width: 150, height: 150 }} />
                        <img src={logoText} alt="Logo" className="mb-10 object-contain" style={{ width: 250, height: 50 }} />

                        <main className="flex w-full space-x-4 mb-6">
                            <button
                                className={`flex-1 py-3 px-4 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A50BE] ${showLogin === 'resident' ? 'bg-[#255ccc]' : 'bg-[#1346AC] hover:bg-[#255ccc]'}`}
                                onClick={() => setShowLogin('resident')}
                            >
                                Barangay Resident
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A50BE] ${showLogin === 'official' ? 'bg-[#255ccc]' : 'bg-[#1346AC] hover:bg-[#255ccc]'}`}
                                onClick={() => setShowLogin('official')}
                            >
                                Barangay Official
                            </button>
                        </main>

                        {showLogin === 'resident' && (
                            <div className="w-full">
                                <ResidentLogin />
                            </div>
                        )}
                        {showLogin === 'official' && (
                            <div className="w-full">
                                <Login />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginOption;
