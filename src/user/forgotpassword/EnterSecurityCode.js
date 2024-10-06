import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import background from '../../assets/images/isb-bg.png'; 

const EnterSecurityCode = () => {
    const [securityCode, setSecurityCode] = useState(''); // Use this to capture security code
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 
    const location = useLocation(); // Use this to get the email passed via navigate
    const navigate = useNavigate();

    // Get the email passed from ForgotpassEmailInput component
    const { email } = location.state || {};

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for empty code
        if (!securityCode) {
            setError('Please enter the security code.');
            return;
        }

        // Validation for code length less than 6 digits
        if (securityCode.length < 6) {
            const numberEntered = securityCode.length;
            setError(
                `You only entered ${numberEntered} ${numberEntered === 1 ? 'number' : 'numbers'}. Please check your code and try again.`
            );
            return;
        }

        setLoading(true);
        setError(''); // Clear any previous error

        try {
            // Send the security code and email to verify
            await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/resident/verify-security-code`, { email, securityCode });
            Swal.fire({
                title: 'Success!',
                text: 'Your code is verified, you can now reset your password.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            
            // Store the resetPasswordToken in localStorage or pass it directly via navigate
            localStorage.setItem('resetPasswordToken', securityCode); // Store the token locally

            navigate('/Resident/reset-password', { state: { email, securityCode } }); // Include token in URL
        } catch (error) {
            // If the code is wrong, show appropriate message
            const errorMessage = error.response?.status === 400 
                ? 'The number you entered doesn’t match your code. Please try again.' 
                : error.response?.data?.message || 'The number you entered doesn’t match your code. Please try again.';
            setError(errorMessage); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4 md:px-32 bg-cover"
            style={{ backgroundImage: `url(${background})` }}
        >
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="bg-white rounded shadow-md">
                    <h2 className="text-2xl font-bold mb-2 text-start p-4 px-4">Enter Security Code</h2>
                    <hr/>

                    <div className='flex flex-col justify-center p-4 px-4'>
                    {error && (
                        <div className={`bg-red-100 border text-red-700 px-4 py-3 rounded relative mb-4`} role="alert">
                            <strong className="font-bold">Error</strong>
                            <br/>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <p className="text-lg text-start mb-4">
                         Please check your email for a message with your code. Your code is 6 numbers long.
                    </p>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Security Code</label>
                    <div className="flex mb-4 space-x-2">                      
                        <input
                            type="number"
                            name="securityCode"
                            placeholder="Enter your Security Code"
                            value={securityCode}
                            onChange={(e) => setSecurityCode(e.target.value)}
                            className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                        />
                        <p className="text-sm">We sent your code to: <br/>{email}</p>  
                    </div>
                    </div>
                    <hr />
                    <div className='flex items-end justify-evenly font-semibold mt-4 p-4'>
                        <button
                            type="submit"
                            className={`w-full py-2 mr-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Verify'}
                        </button>
                        <button
                            type="button"
                            className="w-full py-2 rounded-md text-black bg-gray-300 hover:bg-gray-400"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EnterSecurityCode;
