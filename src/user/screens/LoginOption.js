import React, { useState } from 'react';
import Login from './Login'; // Import the Login component for Barangay Officials
import ResidentLogin from './Resident/ResidentLogin'; // Import the Resident Login component
import backgroundImage from '../../assets/images/login.jpg'; 
import barangayLogo from '../../assets/images/iServe-Barangay-login.png';
import logoText from '../../assets/images/iServeBarangay-Text-login.png';

const LoginOption = () => {
    const [showLogin, setShowLogin] = useState('resident'); 

    return (
        <div className="h-screen overflow-hidden flex bg-white font-sans">
            <div className="flex flex-col items-center justify-center w-full lg:w-1/4 p-10">
                <img src={barangayLogo} alt="Barangay Logo" style={{ width: 250, height: 250, marginBottom: 10 }} />
                <img src={logoText} alt="Logo" style={{ width: 350, height: 50, marginBottom: 30 }} />
                <main className="flex w-full space-x-4 mb-2"> 
                    <button
                        className={`flex-1 py-3 px-4 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A50BE] ${
                            showLogin === 'resident' ? 'bg-[#255ccc]' : 'bg-[#1346AC] hover:bg-[#255ccc]'
                        }`}
                        onClick={() => setShowLogin('resident')}
                    >
                        Barangay Resident
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A50BE] ${
                            showLogin === 'official' ? 'bg-[#255ccc]' : 'bg-[#1346AC] hover:bg-[#255ccc]'
                        }`}
                        onClick={() => setShowLogin('official')}
                    >
                        Barangay Official
                    </button>
                </main>

                {showLogin === 'resident' && (
                    <div className="w-full mt-2"> 
                        <ResidentLogin />
                    </div>
                )}
                {showLogin === 'official' && (
                    <div className="w-full mt-2"> 
                        <Login />
                    </div>
                )}
            </div>
            <div className="hidden lg:block w-3/4">
                <img src={backgroundImage} alt="Barangay Assembly" className="w-full h-full object-obtain" />
            </div>
        </div>
    );
};

export default LoginOption;
