import React, { useState } from 'react';
import axios from 'axios';
import background from '../../assets/images/isb-bg.png'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ForgotpassEmailInput = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // State to handle error message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email is provided
        if (!email) {
            setError('Please fill in at least one field to search for your account');
            return;
        }

        setLoading(true);
        setError(''); 

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/resident/forgot-password`, { email });
            Swal.fire({
                title: 'Success!',
                text: 'A reset code has been sent to your email!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            navigate('/Resident/enter-security-code', { state: { email } });
        } catch (error) {
            // Customize error message when no account is found
            const errorMessage = error.response?.status === 404 
                ? 'No search results. Your search did not return any results. Please try again with other information.'
                : error.response?.data?.message || 'Something went wrong. Please try again.';
            
            setError(errorMessage); // Set error message based on the response
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
                    <h2 className="text-2xl font-bold mb-2 text-start p-4 px-4">Find Your Account</h2>
                    <hr/>

                    <div className='flex flex-col justify-center p-4 px-4'>
                    {error && (
                        <div className={`bg-red-100 border ${error.includes('No search results') ? 'border-red-400' : 'border-red-500'} text-red-700 px-4 py-3 rounded relative mb-4`} role="alert">
                            <strong className="font-bold">{error.includes('No search results') ? 'No Search Results' : 'Please fill in at least one field'}</strong>
                            <br/>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <p className="text-lg text-start mb-4">
                        Please enter your email to search for your account.
                    </p>
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>         
                    </div>
                    <hr />
                    <div className='flex items-end justify-evenly font-semibold mt-4 p-4'>
                        <button
                            type="submit"
                            className={`w-full py-2 mr-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Search'}
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

export default ForgotpassEmailInput;
