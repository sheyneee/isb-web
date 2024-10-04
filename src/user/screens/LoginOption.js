import React, { useEffect, useState } from 'react';
import Login from './Login'; // The single Login component with both Resident and Official login logic
import barangayLogo from '../../assets/images/iServe-Barangay-login.png';
import background from '../../assets/images/isb-bg.png'; // Imported background image
import Swal from 'sweetalert2'; // Import SweetAlert2

const LoginOption = () => {
    const [showLogin, setShowLogin] = useState('resident');

    const checkForVerification = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const verified = urlParams.get('verified');
        console.log('Verification Status:', verified); 
        if (verified === 'true') {
            Swal.fire({
                title: 'Success!',
                text: 'Email verified successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal-confirm-button' // Add this custom class to the confirm button
                }
            });            
        }
    };    
    useEffect(() => {
        checkForVerification();
    }, []);

    return (
        <div
            className="min-h-screen w-full flex items-center justify-between px-32 bg-cover"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-md shadow-md w-full max-w-lg h-full">
                <div className="flex flex-col items-center justify-center w-full max-w-md">
                    <img src={barangayLogo} alt="Barangay Logo" className="h-48 w-48" />
                    <h1 className="text-[#1346AC] text-4xl font-bold font-sans mt-2">
                        iServe Barangay
                    </h1>
                </div>

                <div className="flex justify-center space-x-8 w-full">
                    <button
                        className={`py-2 px-4 text-lg font-medium focus:outline-none ${showLogin === 'resident' ? 'text-blue-800 border-b-4 border-blue-800' : 'text-gray-500 border-b-4 border-transparent'}`}
                        onClick={() => setShowLogin('resident')}
                    >
                        Resident
                    </button>
                    <button
                        className={`py-2 px-4 text-lg font-medium focus:outline-none ${showLogin === 'official' ? 'text-blue-800 border-b-4 border-blue-800' : 'text-gray-500 border-b-4 border-transparent'}`}
                        onClick={() => setShowLogin('official')}
                    >
                        Official
                    </button>
                </div>

                <div className="flex items-center justify-center w-full h-auto">
                    <Login loginType={showLogin === 'resident' ? 'Resident' : 'Official'} />
                </div>
            </div>
        </div>
    );
};

export default LoginOption;
